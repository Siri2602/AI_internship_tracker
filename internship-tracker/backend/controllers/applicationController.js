const Application = require('../models/Application');

// @desc  Get all applications for user
// @route GET /api/applications
exports.getApplications = async (req, res, next) => {
  try {
    const { status, priority, search, sort = '-applicationDate', page = 1, limit = 50 } = req.query;
    const query = { user: req.user._id };

    if (status && status !== 'All') query.status = status;
    if (priority && priority !== 'All') query.priority = priority;
    if (search) {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [applications, total] = await Promise.all([
      Application.find(query).sort(sort).skip(skip).limit(Number(limit)),
      Application.countDocuments(query),
    ]);

    res.json({ success: true, count: applications.length, total, applications });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single application
// @route GET /api/applications/:id
exports.getApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, user: req.user._id });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found.' });
    res.json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// @desc  Create application
// @route POST /api/applications
exports.createApplication = async (req, res, next) => {
  try {
    const application = await Application.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// @desc  Update application
// @route PUT /api/applications/:id
exports.updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!application) return res.status(404).json({ success: false, message: 'Application not found.' });
    res.json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete application
// @route DELETE /api/applications/:id
exports.deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found.' });
    res.json({ success: true, message: 'Application deleted.' });
  } catch (error) {
    next(error);
  }
};

// @desc  Get analytics/stats
// @route GET /api/applications/stats
exports.getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [statusBreakdown, priorityBreakdown, monthlyTrend, recentActivity] = await Promise.all([
      Application.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Application.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
      Application.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: {
              year: { $year: '$applicationDate' },
              month: { $month: '$applicationDate' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 },
      ]),
      Application.find({ user: userId }).sort('-updatedAt').limit(5).select('company role status updatedAt'),
    ]);

    const total = await Application.countDocuments({ user: userId });
    const offers = await Application.countDocuments({ user: userId, status: 'Offer' });
    const interviews = await Application.countDocuments({ user: userId, status: 'Interview' });
    const responseRate = total > 0 ? Math.round(((offers + interviews) / total) * 100) : 0;

    res.json({
      success: true,
      stats: {
        total,
        offers,
        interviews,
        responseRate,
        statusBreakdown,
        priorityBreakdown,
        monthlyTrend,
        recentActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Bulk delete applications
// @route DELETE /api/applications/bulk
exports.bulkDelete = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const result = await Application.deleteMany({ _id: { $in: ids }, user: req.user._id });
    res.json({ success: true, deleted: result.deletedCount });
  } catch (error) {
    next(error);
  }
};
