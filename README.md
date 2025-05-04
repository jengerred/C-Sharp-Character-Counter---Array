# Character Counter - Array Assignment (CSCI312)

## Assignment Overview

### Course Context
CSCI312: Character Counter - Array

### Assignment Description
Design a program that reads in an ASCII text file (provided) one byte at a time and creates an output file that contains the frequency count of how many times each character appears in the input file.

### Requirements
* Do not sort the output
* Each unique character must be represented by a character frequency class instance
* Character frequency objects must be processed and stored using an array

### Example Input/Output
Example input file: Hello.

**Output Format:**
Character (ASCII value) (tab) Frequency

### Command Line Execution
```
counter.exe myInput.txt Count.txt
```

## Learning Objectives
* Understand array manipulation in C#
* Implement file I/O operations
* Create a character frequency tracking class
* Process input files byte by byte

## Project Setup Checklist
1. Open Visual Studio
2. Create a new Console Application project
3. Name the project "CharacterCounter"
4. Add a new class named "CharacterFrequency"
5. Implement character frequency tracking logic
6. Add file processing methods
7. Build and test the application

## Implementation Guide

### Step 1: Open Visual Studio
Launch Visual Studio to begin your project setup.
1. Open Visual Studio
2. Click "Create a new project"
3. Select "Console App" or "Console Application"

### Step 2: Create Console Application Project
Configure your new Console Application project.
1. Choose C# as the programming language
2. Select Console Application template
3. Configure project settings

### Step 3: Name the Project "CharacterCounter"
Set the project name and solution configuration.
1. Enter "CharacterCounter" as project name
2. Choose project location
3. Confirm solution name

### Step 4: Add CharacterFrequency Class
Create a new class to handle character frequency tracking.
1. Right-click project in Solution Explorer
2. Select "Add" > "Class"
3. Name the class "CharacterFrequency.cs"

### Step 5: Implement Character Frequency Logic
Add methods to track and manage character frequencies.
1. Implement frequency tracking methods
2. Add character and frequency getters
3. Create output formatting

### Step 6: Add File Processing Methods
Implement methods to read files and process character frequencies.
1. Create file reading method
2. Implement byte-by-byte processing
3. Track character frequencies
4. Write results to output file

### Step 7: Build and Test Application
Compile the project and test with sample input files.
1. Build the solution
2. Create a sample input text file
3. Run the application with input arguments
4. Verify output file contents
