import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css'; // Default light theme
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-bash';

interface CharacterFrequency {
  character: string;
  asciiCode: number;
  frequency: number;
}

export default function Home() {
  const [fileContent, setFileContent] = useState<string>('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [characterFrequencies, setCharacterFrequencies] = useState<CharacterFrequency[]>([]);
  const [showCharacterFrequencies, setShowCharacterFrequencies] = useState(false);
  const [showInitialImplementationSteps, setShowInitialImplementationSteps] = useState(false);

  // Effect to highlight code blocks after component mounts/updates
  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure this runs only in the browser
      console.log('PRISM: Attempting to highlight all code blocks (client-side).');
      Prism.highlightAll();
    }
  }, []); // Run once after initial render and client-side hydration


  useEffect(() => {
    const startTime = performance.now();
    const controller = new AbortController();
    const fetchStream = async () => {
      try {
        console.time('File Fetch and Process');
        const response = await fetch('http://localhost:7777/api/FileProcessing/file-content', {
          signal: controller.signal
        });
        
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';
        let chunkCount = 0;

        // const updateFileContent = (chunk: string) => {
        //   // Batch updates to reduce re-renders
        //   if (chunkCount % 10 === 0) {
        //     setFileContent(prev => prev + chunk);
        //   }
        //   chunkCount++;
        // };

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;
          // updateFileContent(chunk); // Don't update state here
        }

        // Final update and processing
        // setFileContent(accumulatedText); // Don't update state here, wait for worker
        
        // Defer heavy processing to next event loop
        setTimeout(() => {
          processFile(accumulatedText);
          const endTime = performance.now();
          console.log(`Total file processing time: ${(endTime - startTime).toFixed(2)}ms`);
          console.timeEnd('File Fetch and Process');
        }, 0);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Error fetching file:', error);
        }
      }
    };

    fetchStream();
    return () => controller.abort();
  }, [])

  const processFile = (text: string) => {
    // Use Web Worker for character frequency calculation
    if (typeof window !== 'undefined' && window.Worker) {
      const worker = new Worker(new URL('../utils/charFreqWorker.ts', import.meta.url));
      
      worker.onmessage = (event) => {
        const { sanitizedFileContent, calculatedFrequencies } = event.data;
        setFileContent(sanitizedFileContent);
        setCharacterFrequencies(calculatedFrequencies);
        worker.terminate();
      };

      worker.onerror = (error) => {
        console.error('Web Worker error:', error);
        worker.terminate();
      };

      worker.postMessage(text);
    } else {
      // Fallback for browsers without Web Worker support
      console.warn('Web Workers not supported, falling back to main thread processing (full text, no sanitization for fallback)');
      // Fallback will process full text for frequencies but won't sanitize or set fileContent here
      const frequencies: { [key: string]: number } = {}

      for (let i = 0; i < text.length; i++) { // Process full text in fallback
        const char = text[i]
        frequencies[char] = (frequencies[char] || 0) + 1
      }

      const frequencyArray: CharacterFrequency[] = Object.entries(frequencies)
        .map(([character, frequency]) => ({
          character,
          asciiCode: character.charCodeAt(0),
          frequency
        }))
        .sort((a, b) => a.asciiCode - b.asciiCode)
        .slice(0, 500);

      setCharacterFrequencies(frequencyArray);
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File upload event triggered');
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        processFile(text)
      }
      reader.readAsText(file);
      console.log('Reading file:', file.name);
    }
  }

  const learningObjectives = [
    'Understand array manipulation in C#',
    'Implement file I/O operations',
    'Create a character frequency tracking class',
    'Process input files byte by byte'
  ]

  const [showExampleOutput, setShowExampleOutput] = useState(false);

  return (
    <div className="container mx-auto p-6">
      <style jsx global>{`
        pre.language-bash .token.comment {
          color: #6A9955 !important; /* VS Code-like green for comments */
        }
      `}</style>
      <Head>
        <title>Character Counter Assignment</title>
      </Head>

      <main>
        <h1 className="text-3xl font-bold mb-6">Character Counter - Array Assignment</h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Assignment Instructions</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="mb-4">CSCI312: Character Counter - Array</p>
            <p className="mb-4">Design a program that reads in an ASCII text file (provided) one byte at a time and creates an output file that contains the frequency count of how many times each character appears in the input file.</p>
            
            <h3 className="font-bold mt-2">Requirements:</h3>
            <ul className="list-disc list-inside mb-4">
              <li>Do not sort the output</li>
              <li>Each unique character must be represented by a character frequency class instance</li>
              <li>Character frequency objects must be processed and stored using an array</li>
            </ul>

            <h3 className="font-bold mt-2">Example Input/Output</h3>
            <div className="mb-4">
              <p className="mb-2">Example input file: Hello.</p>
              <button 
                onClick={() => setShowExampleOutput(!showExampleOutput)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                {showExampleOutput ? 'Hide' : 'Show'} Output
              </button>
            </div>

            {showExampleOutput && (
              <div className="bg-[#1E1E1E] p-3 rounded-md">
                <pre className="whitespace-pre-wrap break-all" style={{
                  backgroundColor: 'black',
                  color: '#EDEDED',
                  fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                  fontWeight: 'normal',
                  fontSize: '0.875em',
                  textShadow: 'none',
                  padding: '1rem',
                  borderRadius: '0.5rem'
                }}>
                  {`(10) 1
(13) 1
.(46) 1
H(72) 1
e(101) 1
l(108) 2
o(111) 1`}
                </pre>
              </div>
            )}

            <h3 className="font-bold mt-2">Output Format:</h3>
            <p>Character (ASCII value) (tab) Frequency</p>

           
            <h3 className="font-bold mt-2">Command Line Execution:</h3>
            <pre style={{
              color: '#333',
              backgroundColor: '#f8f8f8',
              border: '2px solid #3b82f6',
              borderRadius: '0.5rem',
              padding: '1rem',
              overflowX: 'auto',
              boxShadow: 'none',
              fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
              fontSize: '0.875em',
              lineHeight: '1.5'
            }} className="whitespace-pre-wrap break-all language-csharp"><code className="language-csharp">
programname.exe &lt;inFile&gt; &lt;outFile&gt;
</code></pre>
            <pre className="whitespace-pre-wrap break-all" style={{
              backgroundColor: 'black',
              color: '#EDEDED',
              fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
              fontWeight: 'normal',
              fontSize: '0.875em',
              textShadow: 'none',
              padding: '1rem',
              borderRadius: '0.5rem'
            }}>counter.exe myInput.txt Count.txt</pre>
            <div className="bg-gray-50 p-3 rounded mt-2 text-sm">
              <h4 className="font-semibold mb-2">Command Line Execution Breakdown</h4>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">1. Program Executable:</span>
                  <p className="text-xs text-gray-600">The compiled C# application that processes character frequencies.</p>
                </div>
                <div>
                  <span className="font-medium">2. Input File:</span>
                  <p className="text-xs text-gray-600">ASCII text file to be analyzed, read byte by byte to count character occurrences.</p>
                </div>
                <div>
                  <span className="font-medium">3. Output File:</span>
                  <p className="text-xs text-gray-600">Destination file where character frequency results will be stored.</p>
                </div>
              </div>
              <p className="text-xs italic text-gray-500 mt-2">
                💡 Tip: Ensure input file exists and you have write permissions for the output file.
              </p>
            </div>
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
            padding: '1rem', 
            backgroundColor: 'white' 
          }}>
              <pre style={{ 
            fontSize: '0.875rem', 
            color: 'black', 
            whiteSpace: 'pre-wrap', 
            wordBreak: 'break-all', 
            fontFamily: 'monospace', 
            backgroundColor: 'white',
            userSelect: 'text' 
          }}>{fileContent.slice(0, 10000).replace(/\[NEWLINE\]/g, '\n')}</pre>
            </div>
            <div style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            height: '0.25rem', 
            backgroundColor: 'white' 
          }}></div>
          </div>
        </section>

        {fileContent && (
          <section className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold">Character Frequency Analysis</h3>
              <button 
                onClick={() => setShowCharacterFrequencies(!showCharacterFrequencies)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                {showCharacterFrequencies ? 'Hide' : 'View'} Expected Output
              </button>
            </div>
             {showCharacterFrequencies && characterFrequencies.length > 0 && (
               <div className="bg-[#1E1E1E] p-3 rounded-md">
                 <pre className="whitespace-pre-wrap break-all" style={{
                  backgroundColor: 'black',
                  color: '#EDEDED',
                  fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                  fontWeight: 'normal',
                  fontSize: '0.875em',
                  textShadow: 'none',
                  padding: '1rem',
                  borderRadius: '0.5rem'
                }}>{characterFrequencies.map((freq) => 
                  `${freq.character === '\n' ? '\\n' : freq.character === '\r' ? '\\r' : freq.character === ' ' ? 'Space' : freq.character}(${freq.asciiCode}) ${freq.frequency}`
                ).join('\n')}</pre>
               </div>
             )}
          </section>
        )}

        <section className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Project Setup Checklist</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <ol className="list-decimal list-inside space-y-2">
              <li>Open Visual Studio</li>
              <li>Create a new Console Application project</li>
              <li>Name the project "YourName_CharacterCounter"</li>
              <li>Add a new class named "CharacterFrequency"</li>
              <li>Implement character frequency tracking logic</li>
              <li>Add file processing methods</li>
              <li>Build and test the application</li>
            </ol>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Implementation Guide</h2>
          <h3 className="text-xl font-semibold mb-4">Step 1: Initial Setup</h3>
          <p>Create a new C# Console Application project named "YourName_CharacterCounter"</p>
          <button
            onClick={() => setShowInitialImplementationSteps(!showInitialImplementationSteps)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition text-sm my-3 inline-block"
          >
            {showInitialImplementationSteps ? 'Hide Step 1 Details' : 'Show me how'}
          </button>
          <div className="space-y-6">
  {showInitialImplementationSteps && (
    <>
     
            <div>
              <h3 className="text-xl font-semibold mb-4">Step 1: Open <a href="https://visualstudio.microsoft.com/" target="_blank" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">Visual Studio</a></h3>
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="w-full md:w-1/2">
                    <p>Click "Create a new project"</p>
                    <div className="w-full md:w-1/2 p-2 bg-gray-100">
                  <img
                    src={'/images/visual-studio-platform.png'}
                    alt="Visual Studio Platform"
                    style={{
                      display: 'block',
                      width: '100%',
                      maxWidth: '800px',
                      height: 'auto',
                      maxHeight: '600px'
                    }}
                    className="mx-auto object-contain rounded-lg shadow-lg border border-gray-200"
                  />
                  
                </div>
                   
                </div>
              
              </div>
              </div>
              <div>
              <h3 className="text-xl font-semibold mb-4">Step 2: Create Console Application Project</h3>
              <p>Select "C# Console Application"</p>
                  
                  <div className="w-full md:w-1/2 p-2 bg-gray-100">
                <img
                  src={'/images/vs-console-app.png'}
                  alt="Visual Studio Console App Selection"
                  style={{
                    display: 'block',
                    width: '100%',
                    maxWidth: '800px',
                    height: 'auto',
                    maxHeight: '600px'
                  }}
                  className="mx-auto object-contain rounded-lg shadow-lg border border-gray-200"
                />
              </div>
              
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Step 3: Name the Project "YourName_CharacterCounter"</h3>
              <ol className="list-decimal list-inside bg-gray-100 p-4 rounded-lg mb-4">
                <li>Enter "YourName_CharacterCounter" as project name</li>
                <li>Choose project location</li>
                <li>Confirm solution name</li>
              </ol>
            </div>
           

    </> 
  )}
</div>


<div>
<h3 className="font-bold mt-2">Step 2: Create CharacterFrequency Class</h3>
<pre style={{
color: '#333',
backgroundColor: '#f8f8f8',
border: '2px solid #3b82f6',
borderRadius: '0.5rem',
padding: '1rem',
overflowX: 'auto',
boxShadow: 'none',
fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
fontSize: '0.875em',
lineHeight: '1.5'
}} className="whitespace-pre-wrap break-all language-csharp">
<code className="language-csharp">{`public class CharacterFrequency
{
public char Character { get; }  // The ASCII character being tracked
public int Frequency { get; private set; } // Number of occurrences

public CharacterFrequency(char character)
{
Character = character;
Frequency = 1;  // Initialize frequency to 1 on creation
}

public void Increment() => Frequency++; // Increase count for repeated characters
}`}</code>
</pre>

<p className="mt-2 text-sm">
The <code>CharacterFrequency</code> class represents a single character and its frequency in the input file. 
Key features:
</p>

<ul className="list-disc list-inside ml-4 text-sm">
<li>Stores the character and its occurrence count</li>
<li>Initializes frequency to 1 when first created</li>
<li>Provides an <code>Increment()</code> method to increase the frequency for repeated characters</li>
</ul>
</div>


<div>
<h3 className="font-bold mt-2">Step 3: Implement Main Method</h3>
<pre style={{
color: '#333',
backgroundColor: '#f8f8f8',
border: '2px solid #3b82f6',
borderRadius: '0.5rem',
padding: '1rem',
overflowX: 'auto',
boxShadow: 'none',
fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
fontSize: '0.875em',
lineHeight: '1.5'
}} className="whitespace-pre-wrap break-all language-csharp">
<code className="language-csharp">{`static void Main(string[] args)
{
// Validate command-line arguments
if (args.Length != 2)
{
Console.WriteLine("Usage: counter.exe inputFile outputFile");
return;
}

string inputFile = args[0];
string outputFile = args[1];

// Array to store CharacterFrequency objects indexed by ASCII value (0-255)
CharacterFrequency[] indexedFrequencies = new CharacterFrequency[256];

ry
{
// Read input file one byte at a time (ASCII is 1 byte per character)
using (FileStream fs = File.OpenRead(inputFile))
{
int currentByte;
while ((currentByte = fs.ReadByte()) != -1) // Read until end of file
{
char c = (char)currentByte; // Convert byte to character
int ascii = (int)c; // Get ASCII value (0-255)

// Track frequency in array
if (indexedFrequencies[ascii] == null)
{
// First occurrence: create new CharacterFrequency object
indexedFrequencies[ascii] = new CharacterFrequency(c);
}
else
{
// Subsequent occurrence: increment frequency
indexedFrequencies[ascii].Increment();
}
}
}

// Output the character frequency results in ASCII order (0-255)
using (StreamWriter sw = new StreamWriter(outputFile))
{
for (int ascii = 0; ascii < 256; ascii++)
{
if (indexedFrequencies[ascii] != null)
{
string charDisplay = (ascii < 32 || ascii == 127) ? "" : indexedFrequencies[ascii].Character.ToString();
string line = (charDisplay == "")
? $"\t({ascii})\t{indexedFrequencies[ascii].Frequency}"
: $"\t{charDisplay}({ascii})\t{indexedFrequencies[ascii].Frequency}";
            </div>
            </>
          )}

                    sw.WriteLine(line);
                    Console.WriteLine(line);
                }
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error: {ex.Message}");
    }
}`}</code>
            </pre>

            <p className="mt-2 text-sm">
              The <code>Main</code> method demonstrates the core logic for character frequency tracking:
            </p> 
            <div>
              <ul className="list-disc list-inside ml-4">
                <li>Validates command-line arguments for input and output files</li>
                <li>Creates a 256-element array to track ASCII character frequencies</li>
                <li>Reads the input file byte by byte using <code>FileStream</code></li>
                <li>Tracks character frequencies in the indexed array</li>
                <li>Writes frequency results to both output file and console</li>
                <li>Handles potential file reading errors</li>
              </ul>
              </div>
          </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Step 4: Build and Test Application</h3>
              <p className="mb-3">Compile the project and test with sample input files.</p>
              <div>
              <ol className="list-decimal list-inside bg-gray-100 p-4 rounded-lg mb-4">
                <li>Build the solution</li>
                <li>Create a sample input text file</li>
                <li>Run the application with input arguments</li>
                <li>Verify output file contents</li>
              </ol>
              </div>
              <pre
  style={{ backgroundColor: 'black', color: '#EDEDED', fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace', fontWeight: 'normal', fontSize: '0.875em', textShadow: 'none' }}
  className="p-4 rounded-lg overflow-x-auto language-bash"
>
{`# Command line execution example
dotnet run CharacterCounter.exe input.txt output.txt`}
              </pre>
            </div>
            </section>
      </main>
    </div>
  )
}