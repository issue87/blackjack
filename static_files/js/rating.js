const navLinks = document.getElementsByClassName("ratingNavigationLink");
const navForm = document.getElementById("ratingNavigationForm");
const targetPageInput = document.getElementById("targetNavPage");
for (let i = 0; i<navLinks.length; i++){
    navLinks[i].addEventListener("click",submitNavForm);
};
function submitNavForm(){
    const incrementStartRow = Number(this.dataset.incrementstartrow);
    console.log(this.dataset.incrementstartrow);
    console.log(typeof(incrementStartRow));
    console.log(incrementStartRow);
    startRow += incrementStartRow;
    console.log(typeof(startRow));
    console.log(startRow);
    targetPageInput.setAttribute("value",startRow.toString());
    //navForm.submit();
}