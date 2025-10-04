// middleware/validation/validateRequest.js
const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    // Parse JSON strings in the request body and convert numeric fields
    if (property === 'body') {
      const fieldsToParse = ['propertyType', 'location', 'price', 'details', 'amenities', 'contactInfo'];
      
      fieldsToParse.forEach(field => {
        if (req.body[field] && typeof req.body[field] === 'string') {
          try {
            req.body[field] = JSON.parse(req.body[field]);
          } catch (error) {
            console.warn(`Failed to parse ${field}:`, error.message);
          }
        }
      });

      // Convert nested numeric fields from strings to numbers
      const convertNumericFields = (obj, path = '') => {
        if (obj && typeof obj === 'object') {
          Object.keys(obj).forEach(key => {
            const fullPath = path ? `${path}.${key}` : key;
            const value = obj[key];
            
            // Convert string numbers to actual numbers
            if (typeof value === 'string' && !isNaN(value) && value.trim() !== '') {
              obj[key] = Number(value);
            }
            
            // Recursively process nested objects
            if (typeof value === 'object' && value !== null) {
              convertNumericFields(value, fullPath);
            }
          });
        }
      };

      // Apply to the entire body and nested objects
      convertNumericFields(req.body);
      
      // Specifically handle common numeric fields that might come as strings
      const numericFields = [
        'price.amount', 
        'details.size', 
        'details.bedrooms', 
        'details.bathrooms',
        'details.floors',
        'details.parkingSpaces'
      ];
      
      numericFields.forEach(field => {
        const keys = field.split('.');
        let current = req.body;
        
        for (let i = 0; i < keys.length - 1; i++) {
          if (current[keys[i]] && typeof current[keys[i]] === 'object') {
            current = current[keys[i]];
          } else {
            break;
          }
        }
        
        const lastKey = keys[keys.length - 1];
        if (current[lastKey] && typeof current[lastKey] === 'string' && !isNaN(current[lastKey])) {
          current[lastKey] = Number(current[lastKey]);
        }
      });
    }

    const { error, value } = schema.validate(req[property], {
      stripUnknown: true,
      abortEarly: false
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorDetails,
        type: 'VALIDATION_ERROR'
      });
    }

    req[property] = value;
    next();
  };
};

module.exports = validateRequest;