const Link = require('../models/Link');
const { validateUrl, validateCode, generateRandomCode } = require('../utils/validation');

const createLink = async (req, res, next) => {
  try {
    const { targetUrl, customCode } = req.body;

    // Validate target URL
    if (!targetUrl || !validateUrl(targetUrl)) {
      return res.status(400).json({ error: 'Invalid URL provided' });
    }

    let code = customCode;

    // If custom code provided, validate it
    if (customCode) {
      if (!validateCode(customCode)) {
        return res.status(400).json({ 
          error: 'Custom code must be 6-8 alphanumeric characters' 
        });
      }

      // Check if code already exists
      const exists = await Link.codeExists(customCode);
      if (exists) {
        return res.status(409).json({ error: 'Code already exists' });
      }
    } else {
      // Generate random code
      let attempts = 0;
      do {
        code = generateRandomCode();
        attempts++;
        if (attempts > 10) {
          return res.status(500).json({ error: 'Failed to generate unique code' });
        }
      } while (await Link.codeExists(code));
    }

    // Create the link
    const link = await Link.create(code, targetUrl);

    res.status(201).json({
      code: link.code,
      targetUrl: link.target_url,
      shortUrl: `${process.env.BASE_URL}/${link.code}`,
      createdAt: link.created_at
    });
  } catch (error) {
    next(error);
  }
};

const getAllLinks = async (req, res, next) => {
  try {
    const links = await Link.findAll();
    
    const formattedLinks = links.map(link => ({
      code: link.code,
      targetUrl: link.target_url,
      totalClicks: link.total_clicks,
      lastClicked: link.last_clicked,
      createdAt: link.created_at,
      shortUrl: `${process.env.BASE_URL}/${link.code}`
    }));

    res.status(200).json(formattedLinks);
  } catch (error) {
    next(error);
  }
};

const getLinkByCode = async (req, res, next) => {
  try {
    const { code } = req.params;

    const link = await Link.findByCode(code);

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.status(200).json({
      code: link.code,
      targetUrl: link.target_url,
      totalClicks: link.total_clicks,
      lastClicked: link.last_clicked,
      createdAt: link.created_at,
      shortUrl: `${process.env.BASE_URL}/${link.code}`
    });
  } catch (error) {
    next(error);
  }
};

const deleteLink = async (req, res, next) => {
  try {
    const { code } = req.params;

    const deletedLink = await Link.delete(code);
    
    if (!deletedLink) {
      return res.status(404).json({ error: 'Link not found' });
    }
    res.status(200).json({ 
      message: 'Link deleted successfully',
      code: deletedLink.code
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLink,
  getAllLinks,
  getLinkByCode,
  deleteLink
};