export const settingsCart = {
  dots: true,
  arrows: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  prevArrow: (
    <div>
      <i className="icon-i-prev"></i>
    </div>
  ),
  nextArrow: (
    <div>
      <i className="icon-i-next"></i>
    </div>
  ),
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2.19,
        slidesToScroll: 2,
        // centerPadding: '10%',
        // centerMode: true,
        dots: false,
        transform: false,
        // infinite: true,
      },
    },
    {
      breakpoint: 400,
      settings: {
        slidesToShow: 2.22,
        slidesToScroll: 2,
        // centerPadding: '10%',
        // centerMode: true,
        dots: false,
        transform: false,
        // infinite: true,
      },
    },
  ],
};
