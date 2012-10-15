# wikexporter

GitHub's Wiki exporter (md to html)
  
  
## Instalation

```bash
$ npm install -g wikexporter
# done! ;)
```
  
## Usage

```bash
$ cd /my/project/path/
$ wikexporter --repo https://github.com/<my_repo>.git
# and you're done! :)
```

This will create (or override) the **wiki/** directory.  
  
```bash
$ wikexporter --help
  Usage: wikexporter [options]

  Options:

    -h, --help                   output usage information
    -V, --version                output the version number
    -r, --repo <github-repo>     GitHub (only) repo where to grab the wiki from (e.g. https://github.com/DiogoNeves/wikexporter.git)
    -d, --directory [directory]  Directory where to put the files (default: wiki/)
```

## Development

Please feel free to contribute! :)  
I'm currently working on supporting more url types and cleaning up the code (yes, it looks awful!)  

## License 

(The MIT License)

Copyright (c) 2012 Diogo Neves &lt;diogo.neves@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
