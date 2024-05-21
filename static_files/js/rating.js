const navLinks = document.getElementsByClassName("ratingNavigationLink");
const navForm = document.getElementById("ratingNavigationForm");
const targetPageInput = document.getElementById("targetNavPage");
console.log(navLinks);
for (let node of navLinks){
    node.addEventListener("click",submitNavForm);
    console.log("innerLoop");
};
function submitNavForm(){
    const incrementStartRow = Number(this.dataset.increment);
    startRow += incrementStartRow;
    targetPageInput.setAttribute("value",startRow.toString());
    navForm.submit();
}