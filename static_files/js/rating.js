const navLinks = document.getElementsByClassName("ratingNavigationLink");
const navForm = document.getElementById("ratingNavigationForm");
const targetPageInput = document.getElementById("targetNavPage");
console.log(navLinks);
for (let i = 0; i<navLinks.length; i++){
    navLinks[i].addEventListener("click",submitNavForm);
};
function submitNavForm(){
    const incrementStartRow = Number(this.dataset.increment);
    startRow += incrementStartRow;
    targetPageInput.setAttribute("value",startRow.toString());
    navForm.submit();
}