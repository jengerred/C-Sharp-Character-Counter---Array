import React, { useState, useEffect } from 'react'
import Head from 'next/head'

interface CharacterFrequency {
  character: string;
  asciiCode: number;
  frequency: number;
}

export default function Home() {
  const [fileContent, setFileContent] = useState<string>('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [characterFrequencies, setCharacterFrequencies] = useState<CharacterFrequency[]>([])

  useEffect(() => {
    fetch('/wap.txt')
      .then(response => response.text())
      .then(text => {
        setFileContent(text)
      })
      .catch(error => console.error('Error fetching file:', error))
  }, [])

  const processFile = (text: string) => {
    const frequencies: { [key: string]: number } = {}

    // Process file byte by byte
    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      frequencies[char] = (frequencies[char] || 0) + 1
    }

    // Convert to CharacterFrequency array
    const frequencyArray: CharacterFrequency[] = Object.entries(frequencies)
      .map(([character, frequency]) => ({
        character,
        asciiCode: character.charCodeAt(0),
        frequency
      }))
      .sort((a, b) => a.asciiCode - b.asciiCode)

    setCharacterFrequencies(frequencyArray)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        processFile(text)
      }
      reader.readAsText(file)
    }
  }

  const learningObjectives = [
    'Understand array manipulation in C#',
    'Implement file I/O operations',
    'Create a character frequency tracking class',
    'Process input files byte by byte'
  ]

  return (
    <div className="container mx-auto p-6">
      <Head>
        <title>Character Counter Assignment</title>
      </Head>

      <main>
        <h1 className="text-3xl font-bold mb-6">Character Counter - Array Assignment</h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Assignment Instructions (AY 2019-2020)</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="mb-4">CSCI312: Character Counter - Array</p>
            <p className="mb-4">Design a program that reads in an ASCII text file (provided) one byte at a time and creates an output file that contains the frequency count of how many times each character appears in the input file.</p>
            
            <h3 className="font-bold mt-2">Requirements:</h3>
            <ul className="list-disc list-inside mb-4">
              <li>Do not sort the output</li>
              <li>Each unique character must be represented by a character frequency class instance</li>
              <li>Character frequency objects must be processed and stored using an array</li>
            </ul>

            <h3 className="font-bold mt-2">Example Input/Output:</h3>
            <p>Example input file: Hello.</p>
            <pre className="bg-white p-2 rounded border mb-4">(10) 1
(13) 1
.(46) 1
H(72) 1
e(101) 1
l(108) 2
o(111) 1</pre>

            <h3 className="font-bold mt-2">Output Format:</h3>
            <p>Character (ASCII value) (tab) Frequency</p>

            <h3 className="font-bold mt-2">Command Line Execution:</h3>
            <pre className="bg-white p-2 rounded border">programname.exe &lt;inFile&gt; &lt;outFile&gt;
Example: counter.exe myInput.txt Count.txt</pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Learning Objectives</h2>
          <ul className="list-disc list-inside">
            {learningObjectives.map((objective, index) => (
              <li key={index} className="mb-2">{objective}</li>
            ))}
          </ul>
        </section>

   

        <section className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">ASCII text file</h2>
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            height: '12rem', 
            border: '2px solid #9ca3af', 
            borderRadius: '0.5rem', 
            backgroundColor: 'white', 
            overflow: 'hidden' 
          }}>
            <div style={{ 
            position: 'absolute', 
            inset: 0, 
            overflowY: 'auto', 
            padding: '1rem' 
          }}>
              <pre style={{ 
            fontSize: '0.875rem', 
            color: 'black', 
            whiteSpace: 'pre-wrap', 
            wordBreak: 'break-all', 
            fontFamily: 'monospace', 
            userSelect: 'text' 
          }}>{fileContent}</pre>
            </div>
            <div style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            height: '0.25rem', 
            backgroundColor: '#d1d5db' 
          }}></div>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Project Setup Checklist</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <ol className="list-decimal list-inside space-y-2">
              <li>Open Visual Studio</li>
              <li>Create a new Console Application project</li>
              <li>Name the project "CharacterCounter"</li>
              <li>Add a new class named "CharacterFrequency"</li>
              <li>Implement character frequency tracking logic</li>
              <li>Add file processing methods</li>
              <li>Build and test the application</li>
            </ol>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Implementation Guide</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Step 1: Open Visual Studio</h3>
              <p className="mb-3">Launch Visual Studio to begin your project setup.</p>
              <ol className="list-decimal list-inside bg-gray-100 p-4 rounded-lg mb-4">
                <li>Open Visual Studio</li>
                <li>Click "Create a new project"</li>
                <li>Select "Console App" or "Console Application"</li>
              </ol>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto language-csharp">
{`// Visual Studio Project Creation Steps
1. Start Visual Studio
2. Click 'Create a new project'
3. Choose 'Console App (.NET Core)'`}
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Step 2: Create Console Application Project</h3>
              <p className="mb-3">Configure your new Console Application project.</p>
              <ol className="list-decimal list-inside bg-gray-100 p-4 rounded-lg mb-4">
                <li>Choose C# as the programming language</li>
                <li>Select Console Application template</li>
                <li>Configure project settings</li>
              </ol>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto language-csharp">
{`// Project Configuration
Project Type: Console Application
Language: C#
Target Framework: .NET Core or .NET Framework`}
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Step 3: Name the Project "CharacterCounter"</h3>
              <p className="mb-3">Set the project name and solution configuration.</p>
              <ol className="list-decimal list-inside bg-gray-100 p-4 rounded-lg mb-4">
                <li>Enter "CharacterCounter" as project name</li>
                <li>Choose project location</li>
                <li>Confirm solution name</li>
              </ol>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto language-csharp">
{`// Naming Convention
Project Name: CharacterCounter
Solution Name: CharacterCounter
Location: [Your chosen directory]`}
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Step 4: Add CharacterFrequency Class</h3>
              <p className="mb-3">Create a new class to handle character frequency tracking.</p>
              <ol className="list-decimal list-inside bg-gray-100 p-4 rounded-lg mb-4">
                <li>Right-click project in Solution Explorer</li>
                <li>Select "Add" {'>'} "Class"</li>
                <li>Name the class "CharacterFrequency.cs"</li>
              </ol>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto language-csharp">
{`public class CharacterFrequency
{
    // Private fields to store character and its frequency
    private char _character;
    private int _frequency;

    public CharacterFrequency(char character)
    {
        _character = character;
        _frequency = 1;
    }

    public void Increment() => _frequency++;
    public char GetCharacter() => _character;
    public int GetFrequency() => _frequency;
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Step 5: Implement Character Frequency Logic</h3>
              <p className="mb-3">Add methods to track and manage character frequencies.</p>
              <ol className="list-decimal list-inside bg-gray-100 p-4 rounded-lg mb-4">
                <li>Implement frequency tracking methods</li>
                <li>Add character and frequency getters</li>
                <li>Create output formatting</li>
              </ol>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto language-csharp">
{`public override string ToString() => 
    $"({(int)_character}) {_frequency}";`}
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Step 6: Add File Processing Methods</h3>
              <p className="mb-3">Implement methods to read files and process character frequencies.</p>
              <ol className="list-decimal list-inside bg-gray-100 p-4 rounded-lg mb-4">
                <li>Create file reading method</li>
                <li>Implement byte-by-byte processing</li>
                <li>Track character frequencies</li>
                <li>Write results to output file</li>
              </ol>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto language-csharp">
{`static void ProcessFile(string inputPath, string outputPath)
{
    var frequencies = new List<CharacterFrequency>();

    using (var reader = new FileStream(inputPath, FileMode.Open))
    {
        int byteRead;
        while ((byteRead = reader.ReadByte()) != -1)
        {
            char ch = (char)byteRead;
            var existingFreq = frequencies
                .FirstOrDefault(f => f.GetCharacter() == ch);

            if (existingFreq != null)
                existingFreq.Increment();
            else
                frequencies.Add(new CharacterFrequency(ch));
        }
    }

    File.WriteAllLines(outputPath, 
        frequencies.Select(f => f.ToString()));
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Step 7: Build and Test Application</h3>
              <p className="mb-3">Compile the project and test with sample input files.</p>
              <ol className="list-decimal list-inside bg-gray-100 p-4 rounded-lg mb-4">
                <li>Build the solution</li>
                <li>Create a sample input text file</li>
                <li>Run the application with input arguments</li>
                <li>Verify output file contents</li>
              </ol>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto language-bash">
{`# Command line execution example
dotnet run CharacterCounter.exe input.txt output.txt`}
              </pre>
            </div>
          </div>
            </section>

           
        <section className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">Interactive Character Frequency Counter</h3>
          <div className="bg-gray-100 p-6 rounded-lg">
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="mb-4 w-full p-2 border rounded"
            />
            {uploadedFile && (
              <div className="mt-4">
                <h4 className="font-bold mb-2">Uploaded File: {uploadedFile.name}</h4>
              </div>
            )}
            {characterFrequencies.length > 0 && (
              <div className="mt-4">
                <h4 className="font-bold mb-2">Character Frequencies</h4>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">Character</th>
                      <th className="border p-2">ASCII Code</th>
                      <th className="border p-2">Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {characterFrequencies.map((freq, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border p-2">{freq.character === '\n' ? '\\n' : freq.character === '\r' ? '\\r' : freq.character === ' ' ? 'Space' : freq.character}</td>
                        <td className="border p-2 text-center">{freq.asciiCode}</td>
                        <td className="border p-2 text-center">{freq.frequency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}