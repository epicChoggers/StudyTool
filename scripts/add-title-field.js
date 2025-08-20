const fs = require('fs');
const path = require('path');

// Function to add title field to a JSON file
function addTitleField(filePath) {
  try {
    // Read the JSON file
    const data = fs.readFileSync(filePath, 'utf8');
    const quizData = JSON.parse(data);
    
    // Check if title field already exists
    if (quizData.length > 0 && quizData[0].title) {
      console.log(`✅ ${path.basename(filePath)} already has title field`);
      return;
    }
    
    // Add title field to each question (using the bank name as default)
    quizData.forEach(question => {
      question.title = question.bank || 'Untitled Quiz';
    });
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(quizData, null, 2));
    console.log(`✅ Added title field to ${path.basename(filePath)}`);
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Function to process all JSON files in the quizzes directory
function processAllQuizFiles() {
  const quizzesDir = path.join(__dirname, '..', 'quizzes');
  
  // Check if quizzes directory exists
  if (!fs.existsSync(quizzesDir)) {
    console.error('❌ Quizzes directory not found');
    return;
  }
  
  // Get all JSON files
  const files = fs.readdirSync(quizzesDir).filter(file => file.endsWith('.json'));
  
  if (files.length === 0) {
    console.log('❌ No JSON files found in quizzes directory');
    return;
  }
  
  console.log(`📁 Found ${files.length} JSON files to process...\n`);
  
  // Process each file
  files.forEach(file => {
    const filePath = path.join(quizzesDir, file);
    addTitleField(filePath);
  });
  
  console.log('\n🎉 Finished processing all quiz files!');
  console.log('\n📝 Next steps:');
  console.log('1. Go through each JSON file in the quizzes/ folder');
  console.log('2. Update the "title" field with a descriptive name');
  console.log('3. Examples: "Abdominal Emergencies", "Cardiac Assessment", "Trauma Management"');
  console.log('4. Save each file after updating');
}

// Run the script
if (require.main === module) {
  processAllQuizFiles();
}

module.exports = { addTitleField, processAllQuizFiles };
