function stripBasename(pathname, basename) {
  if (basename === '/') return pathname;

  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }

  let nextChar = pathname.charAt(basename.length);
  console.log(nextChar);
  if (nextChar && nextChar !== '/') {
    // pathname does not start with basename/
    return null;
  }

  return pathname.slice(basename.length) || '/';
}
console.log(stripBasename('/foo/bar/baz/asdf', '/foo/bar/baz/asdf'));
