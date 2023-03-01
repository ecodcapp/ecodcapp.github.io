const saberMasOpen = document.getElementById('saberMasOpen');
saberMasOpen.addEventListener('click', openSaberMas);
const saberMasClose = document.getElementById('saberMasClose');
saberMasClose.addEventListener('click', closeSaberMas);

async function openSaberMas(e) {

    const saberMasBtn = document.getElementById('saberMasBtn');
    const saberMasOpen = e.currentTarget;
    const saberMasClose = document.getElementById('saberMasClose')
    const main = document.getElementsByTagName('main')[0];

    const saberMasContenido = document.getElementById('saberMasContenido');
    saberMasContenido.style.top = 0;
    // saberMasContenido.scrollBy()

    saberMasBtn.style.backgroundColor = 'lightcoral';
    saberMasBtn.style.borderColor = 'white';

    saberMasOpen.style.transform = 'translateY(-1.8rem)';
    saberMasClose.style.transform = 'translateY(-1.8rem)';

    buzz(20);

    main.style.filter = 'blur(.1rem)';

    saberMasContenido.scrollBy({
        top: saberMasContenido.scrollHeight,
        behavior: 'instant'
    });
    await timeout(300);
    saberMasContenido.scrollBy({
        top: -saberMasContenido.scrollHeight,
        behavior: 'smooth'
    });

}

function closeSaberMas(e) {

    const saberMasBtn = document.getElementById('saberMasBtn');
    const saberMasOpen = document.getElementById('saberMasOpen')
    const saberMasClose = e.currentTarget;
    const main = document.getElementsByTagName('main')[0];

    const saberMasContenido = document.getElementById('saberMasContenido');
    saberMasContenido.style.top = '-110vh';

    saberMasBtn.style.backgroundColor = 'var(--headerBG)';
    saberMasBtn.style.borderColor = 'lightcoral';

    saberMasOpen.style.transform = 'translateY(0)';
    saberMasClose.style.transform = 'translateY(0)';

    buzz(20);

    main.style.filter = 'blur(0)';

    // COLLAPSE ALL OPENED SUBSECTIONS WITHIN SABERMAS
    $header = $(".saberMasHeader[data-open='1']");
    $icon = $header.children(".closeIcon");
    $content = $header.next();
    $content.slideToggle(400);

    $header.each(function (i) {
        $header[i].dataset.open = "0";
        $icon[i].style.transform = 'rotate(0)';
    });

}

$(".saberMasHeader").click(function () {

    $header = $(this);
    $header[0].dataset.open = $header[0].dataset.open === "0" ? "1" : "0";
    $icon = $header.children(".closeIcon")[0];
    $content = $header.next();
    $header[0].dataset.open === "1" ?
        $icon.style.transform = 'rotate(180deg)' :
        $icon.style.transform = 'rotate(0)'

    // $otherSection = $header.parent().siblings().children();
    // $headerS = $header.parent().siblings().children(".subsubsectionHeader");


    // if($header[0].dataset.open === "1" && $headerS[0].dataset.open === "1") {
    //     $iconS = $headerS.children(".closeIcon")[0];
    //     $contentS = $header.parent().siblings().children(".subsubsectionContent");

    //     $headerS[0].dataset.open = $headerS[0].dataset.open === "0" ? "1" : "0";
    //     $contentS.slideToggle(400);
    //     $iconS.style.transform += 'rotate(180deg)';
    // }

    $content.slideToggle(400);
});