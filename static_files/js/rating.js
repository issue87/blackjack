const navLinks = document.getElementsByClassName("ratingNavigationLink");
const navForm = document.getElementById("ratingNavigationForm");
const targetPageInput = document.getElementById("targetNavPage");
console.log(navLinks);
iterableNavLinks = Array.from(navLinks);
console.log(iterableNavLinks);
for (let node of iterableNavLinks){
    console.log("innerLoop");
    node.addEventListener("click",submitNavForm);
};
function submitNavForm(){
    const incrementStartRow = Number(this.dataset.increment);
    startRow += incrementStartRow;
    targetPageInput.setAttribute("value",startRow.toString());
    navForm.submit();
}