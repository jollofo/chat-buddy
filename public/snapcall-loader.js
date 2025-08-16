(function load(){
  if (window.Snapcall) return;
  var s = document.createElement('script');
  s.src = 'https://snapcall.app/sdk.js';
  s.async = true;
  document.head.appendChild(s);
})();