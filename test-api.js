import fetch from 'node-fetch';

async function testCoursesAPI() {
  console.log('Testing Courses API...');
  
  // Test 1: Get all courses
  console.log('\n1. Testing GET /courses');
  try {
    const response = await fetch('http://localhost:8080/courses');
    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Test 2: Get course by ID
  console.log('\n2. Testing GET /courses/1');
  try {
    const response = await fetch('http://localhost:8080/courses/1');
    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Test 3: Create a new course
  console.log('\n3. Testing POST /courses');
  try {
    const response = await fetch('http://localhost:8080/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: '测试课程',
        description: '这是一门测试课程',
        coverImage: 'https://example.com/test.jpg',
        status: 1
      })
    });
    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Test 4: Get chapters for a course
  console.log('\n4. Testing GET /chapters/course/1');
  try {
    const response = await fetch('http://localhost:8080/chapters/course/1');
    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  // Test 5: Get sections for a chapter
  console.log('\n5. Testing GET /sections/chapter/1');
  try {
    const response = await fetch('http://localhost:8080/sections/chapter/1');
    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testCoursesAPI();
