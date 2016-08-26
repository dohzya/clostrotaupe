const rAF = ( (W: any) =>
  W.requestAnimationFrame       ||
  W.webkitRequestAnimationFrame ||
  W.mozRequestAnimationFrame    ||
  function(c: ()=> any){ W.setTimeout( c, 1000/60) }
)(window);

export default rAF
