const navLinks = document.getElementsByClassName("ratingNavigationLink");
const navForm = document.getElementById("ratingNavigationForm");
const targetPageInput = document.getElementById("targetNavPage");
for (let node of navLinks){
    node.addEventListener("click",submitNavForm);
};
function submitNavForm(){
    const incrementStartRow = Number(this.dataset.increment);
    startRow += incrementStartRow;
    targetPageInput.setAttribute("value",startRow.toString());
    navForm.submit();
}