const fs = require('fs');
const path = require('path');

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  let files = fs.readdirSync(dir);
  files.forEach(file => {
    let p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.jsx') || p.endsWith('.js')) {
      let c = fs.readFileSync(p, 'utf8');
      if (!c.startsWith('"use client"') && !c.startsWith("'use client'")) {
        if (/useState|useEffect|useRef|useCallback|usePathname|motion|gsap|Lenis|useScroll|useForm|createContext/g.test(c)) {
          fs.writeFileSync(p, '"use client";\n' + c);
          console.log('Added to ' + p);
        }
      }
    }
  });
}

walk('views');
walk('components');
walk('lib');
