const navLinks = document.getElementsByClassName("ratingNavigationLink");
const navForm = document.getElementById("ratingNavigationForm");
const targetPageInput = document.getElementById("targetNavPage");
iterableNavLinks = Array.from(htmlCollection);
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