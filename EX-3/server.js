const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    console.log(`Received ${method} request for ${url}`);

    // Home Route
    if (url === '/' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });

        return res.end('Welcome to the Home Page');
    }

    // Contact Form Route
    if (url === '/contact' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });

        res.end(`
          <form method="POST" action="/contact">
            <input type="text" name="name" placeholder="Your name" />
            <button type="submit">Submit</button>
          </form>
        `);

        return;
    }

    // Handle Form Submission
    if (url === '/contact' && method === 'POST') {

        let body = '';

        // Receive data chunks
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        // Finished receiving data
        req.on('end', () => {

            console.log('Raw Form Data:', body);

            // Parse form data
            const formData = new URLSearchParams(body);

            const name = formData.get('name');

            console.log('Submitted Name:', name);

            // Save to file
            fs.appendFile('submissions.txt', name + '\n', (err) => {

                if (err) {
                    console.error(err);

                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });

                    return res.end('Error saving submission');
                }

                // Success response
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });

                return res.end(`
                    <h1>Submission Successful</h1>
                    <p>Thank you, ${name}!</p>
                `);
            });
        });

        return;
    }

    // 404 Route
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });

        return res.end('404 Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});