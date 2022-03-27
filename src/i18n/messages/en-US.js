import { LOCALES } from "../locales";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [LOCALES.ENGLISH]: {
    //Header
    projectName: "Paint by number generator",
    generator: "Gererator",
    coloringPicture: "Coloring picture",
    shoppingCart: "Shopping cart",
    myProfile: "My profile",

    //Home
    desctiptionProject: "Create and color pictures by numbers online",

    //Generator
    inputFile:
      "Paste from clipboard (ctrl+v) to change the image (or browse for a file",
    inputFile1: ". Large images are very slow to process though.",
    exampleImages: "Example images:",
    trivial: "trivial",
    small: "small",
    medium: "medium",
    input: "Input",
    options: "Options",
    resizeImage: "Resize image larger than",
    resizeImageInfo:
      "If checked and the input image is larger than the given dimensions then it will be resized to fit but will maintain its ratio.",
    width: "width",
    height: "height",
    numberOfColors: "Number of colors",
    numberOfColorsInfo: "The number of colors to quantize the image to",
    clusterPrecision: "Cluster precision",
    clusterPrecisionInfo:
      "The threshold delta distance of the k-means clustering to reach before stopping. Having a bigger value will speed up the clustering but may yield suboptimal clusters.",
    randomSeed: "Random seed",
    randomSeedInfo:
      "The seed to use for the random number generator to choose the initial centroids for k-means clusering. Using the same seed ensures you will get the same result every time.",
    clusteringColorSpace: "Clustering color space",
    clusteringColorSpaceInfo: "The color space to apply clustering in",
    restrictClusteringColors: "Restrict clustering colors",
    restrictClusteringColorsInfo:
      'Specify which colors should be used, one per line in "r,g,b" format. Use // as comment. If no colors are specified no restrictions are applied. Useful if you only have a few colors of paint on hand.',
    numberOfRuns: "Number of runs for narrow pixel cleanup",
    numberOfRunsInfo:
      "Narrow pixel cleanup removes strips of single pixel rows, which would make some facets have some borders segments that are way too narrow to be useful. The small facet removal can introduce new narrow pixel strips, so this is repeated in a few iterative runs.",
    removeSmallFacets: "Remove small facets smaller than (pixels)",
    removeSmallFacetsInfo:
      "Removes any facets that are smaller than the given amount of pixels. Lowering the value will create more detailed results but might be much harder to actually paint due to their size.",
    maximumNumberOfFacets: "Maximum number of facets",
    maximumNumberOfFacetsInfo:
      "If there are more facets than the given maximum number, keep removing the smallest facets until the limit is reached",
    smallFacetRemovalOrder: "Small facet removal order",
    smallFacetRemovalOrderInfo:
      "Largest to smallest will prevent boundaries from warping the shapes because the smaller facets act as border anchorpoints but can be considerably slower",
    largestToSmallest: "Largest to smallest",
    smallestToLargest: "Smallest to largest",
    amountOfTimes: "Amount of times to halve border segment complexity",
    amountOfTimesInfo:
      "Reducing the amount of points in a border segment (using haar wavelet reduction) will smooth out the quadratic curve more but at a loss of detail. <br/>A segment (shared border with a facet) will always retain its start and end point.",
    processImage: "Process image",
    kMeansClustering: "K-means clustering",
    facetBuilding: "Facet building",
    smallFacetPruning: "Small facet pruning",
    borderDetection: "Border detection",
    borderSegmentation: "Border segmentation",
    labelPlacement: "Label placement",
    SVGGeneration: "SVG generation",
    quantizedImage: "Quantized image",
    facetReduction: "Facet reduction",
    borderTracing: "Border tracing",
    output: "Output",
    log: "Log",
    SVGRenderOptions: "SVG Render options",
    showLabels: "Show labels",
    fillFacets: "Fill facets",
    showBorders: "Show borders",
    SVGSizeMultiplier: "SVG size multiplier",
    SVGSizeMultiplierInfo:
      "Increases the SVG size compared to the original image, useful when the labels do not fit inside the tiny segments",
    labelFontSize: "Label font size",
    labelFontSizeInfo:
      "Font size of the color number labels in each facet, in percentage relative to the largest circle found inside a facet.",
    labelFontColor: "Label font color",
    labelFontColorInfo: "Font color of the color number labels in each facet",
    downloadSVG: "Download SVG",
    downloadPNG: "Download PNG",
    downloadPalette: "Download palette",
    saveInProfile: "Save in profile",

    //Coloring picture
    currentColor: "Current Color",
    loadLatestImage: "Load latest image",
    savePictureInMyPicture: "Save picture to my pictures",
    pictureName: "Picture name",
    save: "Save picture",
    imageNotLoaded: "Image not loaded!",

    //Shopping cart
    cart: "Cart",
    name: "Name",
    size: "Size(diagonal)",
    sm: "cm",
    delete: "Delete",
    cartLoading: "Cart is loading",
    order: "Order",
    quantityProduct: "Quantity of goods",
    totalPrice: "Total price",
    ordering: "Order",

    //Dropdown menu
    myPictures: "My pictures",
    myOrders: "My orders",
    authorization: "Authorization",
    registration: "Registration",
    helpAboutTheProgram: "Help about the program",
    exit: "Exit",

    //My profile
    myAccount: "My account",
    mail: "Mail",
    editPassword: "Change password",
    editPassText: "To change the password, you must enter the old password",
    lastPassword: "Last password",
    newPassword: "New password",
    updatePassword: "Update password",
    restorePassword: "Restore password",

    //My images
    edit: "Edit",
    sizes: "Canvas size(diagonal)",
    addToCart: "Add to cart",
    coloring: "Colorize",
    loadPictures: "Pictures are loading or not found",
    loadOrders: "Orders are loading or not found",

    //Info
    info1: "Web application for creating pictures by numbers.",
    info2: "Developer: Fomov Maxim Alexandrovich, student of group 38TP.",
    info3: "The project was developed as part of a graduation project.",
    info4: "This project considers the following main functions:",
    info5: "Generation of a picture by numbers",
    info6: "Coloring a picture by numbers",
    info7: "Ordering a painting by numbers and palettes of colors",
    info8: "Switch language",

    //Authorization
    password: "Password",
    logIn: "Log in",

    //Registration
    register: "Register",
  },
};
