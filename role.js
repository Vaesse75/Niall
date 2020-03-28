this.ref=function(id) {
    return "<@&"+(this[id.toLowerCase()]||id.toLowerCase())+">";
}
this.set=function(id,val) {
    this[id.toLowerCase()]=val;
}
