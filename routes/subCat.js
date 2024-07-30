const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { SubCategory } = require('../models/SubCat');

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post('/create', upload.array('images'), async (req, res) => {
    let imagesArr = [];
  
    try {
      for (let i = 0; i < req.files?.length; i++) {
        const result = await cloudinary.uploader.upload(req.files[i].path, {
          use_filename: true,
          unique_filename: false,
          overwrite: false,
        });
        imagesArr.push(result.secure_url);
        fs.unlinkSync(req.files[i].path);
      }
  

      console.log('body',req.body)
      console.log('body',imagesArr)

      let subCategory = new SubCategory({
        category: req.body.category,
        subCat: req.body.subCat,
        image: imagesArr.length > 0 ? imagesArr[0] : null, // Assuming one image per subcategory
      });
  
      subCategory = await subCategory.save();
      res.status(201).json(subCategory);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
      });
    }
  });

// Updated API route for fetching subcategories
router.get(`/`, async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const perPage = 20;
  
      const totalPosts = await SubCategory.countDocuments();
      const totalPages = Math.ceil(totalPosts / perPage);
  
      if (page > totalPages && totalPages !== 0) {
        return res.status(404).json({ message: "No data found!" });
      }
  
      const subCategoryList = await SubCategory.find()
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
  
      if (subCategoryList.length === 0 && totalPosts !== 0) {
        return res.status(404).json({ message: "No data found!" });
      }
  
      return res.status(200).json({
        subCategoryList: subCategoryList,
        totalPages: totalPages,
        page: page,
      });
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      res.status(500).json({ success: false, message: "An error occurred while fetching subcategories." });
    }
  });
  
router.get('/:id', async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate('category');
    if (!subCategory) {
      return res.status(404).json({ message: 'The subcategory with the given ID was not found.' });
    }
    res.status(200).json(subCategory);
  } catch (error) {
    console.error('Error fetching subcategory:', error);
    res.status(500).json({ success: false, message: 'An error occurred while fetching the subcategory.' });
  }
});

router.put('/:id', upload.array('images'), async (req, res) => {
    let imagesArr = [];
  
    try {
      if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const result = await cloudinary.uploader.upload(req.files[i].path, {
            use_filename: true,
            unique_filename: false,
            overwrite: false,
          });
          imagesArr.push(result.secure_url);
          fs.unlinkSync(req.files[i].path);
        }
      }
  
      const subCategory = await SubCategory.findByIdAndUpdate(
        req.params.id,
        {
          category: req.body.category,
          subCat: req.body.subCat,
          image: imagesArr.length > 0 ? imagesArr[0] : req.body.image, // Update image if new one is uploaded
        },
        { new: true }
      );
  
      if (!subCategory) {
        return res.status(500).json({
          message: 'SubCategory cannot be updated!',
          success: false,
        });
      }
  
      res.status(200).json(subCategory);
    } catch (error) {
      console.error('Error updating subcategory:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
      });
    }
  });
  

router.delete('/:id', async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) {
      return res.status(404).json({
        message: 'SubCategory not found!',
        success: false,
      });
    }

    if (subCategory.image) {
      const imgUrl = subCategory.image;
      const urlArr = imgUrl.split('/');
      const image = urlArr[urlArr.length - 1];
      const imageName = image.split('.')[0];
      await cloudinary.uploader.destroy(imageName);
    }

    await SubCategory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'SubCategory Deleted!',
    });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
});

module.exports = router;
