const salesService = require('../services/salesServices');

const health = (req, res) => {
  res.json({ 
    status: "OK", 
    message: "TruEstate API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
};

const getSales = async (req, res) => {
  try {
    console.log('Sales query:', req.query);

    const filters = {
      search: req.query.search || '',
      regions: req.query.regions ? req.query.regions.split(',') : [],
      gender: req.query.gender ? req.query.gender.split(',') : [],
      categories: req.query.categories ? req.query.categories.split(',') : [],
      tags: req.query.tags ? req.query.tags.split(',') : [],
      paymentMethods: req.query.paymentMethods ? req.query.paymentMethods.split(',') : [],
      ageMin: req.query.ageMin,
      ageMax: req.query.ageMax,
      dateStart: req.query.dateStart,
      dateEnd: req.query.dateEnd,
      sort: req.query.sort || 'date_desc',
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10
    };

    if (filters.page < 1) filters.page = 1;
    if (filters.limit < 1 || filters.limit > 100) filters.limit = 10;

    const result = await salesService.getSales(filters);

    res.json({
      success: true,
      ...result,
      filters: filters
    });

  } catch (error) {
    console.error('Error in getSales controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

const getFilterMeta = async (req, res) => {
  try {
    const meta = await salesService.getFilterMeta();
    
    res.json({
      success: true,
      ...meta
    });

  } catch (error) {
    console.error('Error in getFilterMeta controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

const getSummaryStats = async (req, res) => {
  try {
    const stats = await salesService.getSummaryStats();
    
    res.json({
      success: true,
      stats: stats
    });

  } catch (error) {
    console.error('Error in getSummaryStats controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

const getSampleData = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const data = await salesService.getSampleData(limit);
    
    res.json({
      success: true,
      data: data,
      count: data.length,
      limit: limit
    });

  } catch (error) {
    console.error('Error in getSampleData controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

module.exports = {
  health,
  getSales,
  getFilterMeta,
  getSummaryStats,
  getSampleData
};