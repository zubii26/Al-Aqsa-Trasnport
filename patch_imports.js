const fs = require('fs');
const filePath = 'src/app/(public)/booking/page.tsx';
let code = fs.readFileSync(filePath, 'utf-8');

code = code.replace("import { Plus, X,  useState, useEffect, useRef, useCallback } from 'react';", "import { useState, useEffect, useRef, useCallback } from 'react';");
code = code.replace("import { CheckCircle", "import { Plus, X, CheckCircle");

fs.writeFileSync(filePath, code, 'utf-8');
console.log("Fixed imports");
