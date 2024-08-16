document.addEventListener("DOMContentLoaded", () => {
    setTimeout(()=>{v12_on_resize();},200);

    const inputs = document.querySelectorAll('form [required]');
    inputs.forEach(input => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label) label.style.fontWeight = 'bold';
    });
});

window.addEventListener("resize", function(event) {
    v12_on_resize();
}, true);

function v12_on_resize()
{
    let const_h=24;
    let work_area=document.getElementById("work_area");
    if (!work_area) return;

    let overflow=document.body.offsetHeight-window.innerHeight;
    let h=work_area.offsetHeight-overflow-const_h;
    work_area.style.height=h+"px";
}