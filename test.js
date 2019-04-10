const router = conf => (target, key, desc) => {
  console.log(conf, target, key, desc, '----')
}
const post = path => {
  console.log('path', path);
  return router({
    path,
  });
}


class UserController {
  @log
  @post('login')
  login(a) {
    return a*2
  }
}
function log(target,name,descriptor){
  var oldValue=descriptor.value;
  descriptor.value=function(){
    console.log(`this is ${name} width`,arguments);
  }
  return descriptor;
}
const a = async () => {
  console.log('await test a')
  return await 1;

}
new UserController().login(1)
console.log(a(),'await ');