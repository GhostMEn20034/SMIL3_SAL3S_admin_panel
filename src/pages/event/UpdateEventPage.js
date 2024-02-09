import { useState, useEffect, Fragment } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import qs from 'qs';

import SetProductDiscounts from "../../components/Event/ProductDiscounts/SetProductDiscounts";
import SearchProducts from "../../components/Event/ProductDiscounts/SearchProducts";
import { eventMenuItems } from "../../utils/consts";
import MenusNavigation from "../../components/CreateProduct/MenusNavigation";
import EventFields from "../../components/Event/EventFields";
import ObjectValueExtractor from "../../utils/objectValueExtractor";
import useAxios from "../../utils/useAxios";
import { encodeOneImage } from "../../utils/ImageServices";
import HtmlTooltip from "../../components/HtmlTooltip";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DeleteEventDialog from "../../components/Event/DeleteEventDialog";

export default function UpdateEventPage() {
    dayjs.extend(utc);

    const [loading, setLoading] = useState(false);
    const [openedDialog, setOpenedDialog] = useState(null);

    const [searchResults, setSearchResults] = useState([]); // Search results in product search menu
    const [page, setPage] = useState(1); // Current page of the product search results
    const [productName, setProductName] = useState(''); // Product name to filtering search result.
    const [sku, setSku] = useState(''); // SKU value in product search menu
    const [categories, setCategories] = useState([]); // List of categories to filtering search result by categories.

    const [categoryChoices, setCategoryChoices] = useState([]); // All possible category choices
    const [pageCount, setPageCount] = useState(1); // Count of pages of the product search results

    const [currentMenu, setCurrentMenu] = useState(0);
    const [status, setStatus] = useState('');
    const [name, setName] = useState(''); // Event name
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [startDate, setStartDate] = useState(dayjs().utc())
    const [endDate, setEndDate] = useState(dayjs().utc().add(5, 'minutes'))
    const [discountedProducts, setDiscountedProducts] = useState([]);
    const [errorHandler, setErrorHandler] = useState(new ObjectValueExtractor({}, false));

    const navigate = useNavigate();
    const api = useAxios('products');
    const { id } = useParams(); // product id parameter

    const handleChangeImage = (e) => {
        let files = e.target.files;

        if (files.length > 0) {
            let newImage = files[0];
            // assign url to the image
            newImage.url = URL.createObjectURL(newImage);
            setImage(newImage);
        };
    };

    const handlePageChange = (_, value) => {
        setPage(value);
    };

    const handleChangeChecked = (productData) => {
        if (discountedProducts.some(product => product._id === productData._id)) {
            setDiscountedProducts((prevValues) => {
                return prevValues.filter(product => product._id !== productData._id);
            });
        } else {
            setDiscountedProducts((prevValues) => {
                return [
                    ...prevValues,
                    {
                        "_id": productData._id,
                        "name": productData.name,
                        "discount_rate": productData.discount_rate
                    }
                ];
            });
        }
    };

    const getEventById = async () => {
        try {
            let response = await api.get(`/admin/events/${id}`);
            let data = await response.data;
            setStatus(data.event.status);
            setName(data.event.name);
            setDescription(data.event.description === null ? '' : data.event.description);
            setImage(data.event.image);
            setStartDate(dayjs.utc(data.event.start_date));
            setEndDate(dayjs.utc(data.event.end_date));
            setDiscountedProducts(data.event.discounted_products);
        } catch (e) {
            navigate(-1);
        }
    };

    const getCategoryChoices = async () => {
        try {
            let response = await api.get('/admin/categories/for-choices');
            let data = await response.data;
            setCategoryChoices(data);
        } catch (err) {
            console.log("Something Went Wrong");
        }
    };

    const getSearchResults = async () => {
        // applyFilters - determines whether function need to include 
        // product filters to the request parameters
        setLoading(true);
        let params = {
            page: page,
            name: productName.trim().length > 0 ? productName : null,
            category: categories,
            sku: sku.trim().length > 0 ? sku : null
        }

        try {
            let response = await api.get('/admin/products/search', {
                params: params,
                paramsSerializer: { serialize: params => qs.stringify(params, { indices: false }) }
            });
            let data = await response.data;
            setPageCount(data.page_count);
            setSearchResults(data.products);
            if (data.page_count < page) {
                setPage(1);
            }
        } catch (e) {
            console.log("Something Went Wrong");
        }
        setLoading(false);
    };

    const updateEvent = async () => {
        let params = {
            name: name,
            description: description.length > 0 ? description : null,
            start_date: startDate.toJSON(),
            end_date: endDate.toJSON(),
            discounted_products: discountedProducts,
        };
        if (image instanceof File) {
            params.image = await encodeOneImage(image);
        }
        
        try {
            await api.put(`/admin/events/${id}`, params);
            navigate(-1);
        } catch (err) {
            let baseErrors = err.response.data?.base_errors;
            setErrorHandler(() => {
                if (baseErrors) {
                    return new ObjectValueExtractor(err.response.data.errors, true);
                } else {
                    return new ObjectValueExtractor(err.response.data.detail, false);
                }
            });
        }
    };

    const deleteEvent = async () => {
        try {
            await api.delete(`/admin/events/${id}`);
            navigate(-1);
        } catch (e) {
            console.log("Something Went Wrong");
        }
    };

    useEffect(() => {
        getEventById();
        getCategoryChoices();
    }, []);

    useEffect(() => {
        getSearchResults();
    }, [page]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {openedDialog === "deleteEvent" && (
                <DeleteEventDialog 
                    open={openedDialog === "deleteEvent"} 
                    setOpen={setOpenedDialog}
                    name={name}
                    handleSubmit={deleteEvent}
                />
            )}
            <Box display={"flex"}>
                <Box sx={{ ml: 3, mt: 3, display: "inline-block" }}>
                    <Typography variant="h4">
                        Update Event
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                        <Button variant="contained" color="warning" onClick={() => navigate(-1)}>
                            Go back
                        </Button>
                    </Box>
                    <Box sx={{ mt: 1 }}>
                        <Button variant="contained" 
                        color="error" 
                        onClick={() => setOpenedDialog("deleteEvent")}>
                            Delete Event
                        </Button>
                    </Box>
                </Box>
                <Box>
                    <Box sx={{ ml: 25, mt: 5 }}>
                        <MenusNavigation value={currentMenu}
                            setValue={setCurrentMenu}
                            labels={eventMenuItems}
                            disabledButtonIndexes={[]} />
                    </Box>
                </Box>
            </Box>
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ mt: 3 }}>
                <Box>
                    {currentMenu === 0 && (
                        <Fragment>
                            <Box display={"flex"}>
                                <Typography variant="body1" sx={{ mb: 2, mr: 1 }}>
                                    Status: <span style={{ color: "#098ed6" }}>{status}</span>
                                </Typography>
                                <HtmlTooltip title={
                                    <Fragment>
                                        <Typography color="inherit"><b>Event Status</b></Typography>
                                        <Typography variant="body2">
                                            There are 3 statuses:
                                            <ul>
                                                <li>
                                                    <b>created</b> - It means that event created but not started.
                                                </li>
                                                <li>
                                                    <b>started</b> - When event is started, the server applies 
                                                    discounts to all specified products in "Product Discount" section.<br />
                                                    Also after event start you 
                                                    cannot change event start date and the end date and product discounts
                                                </li>
                                                <li>
                                                    <b>ended</b> - When event is ended, the server removes discounts 
                                                    from products specified in "Product Discount" section. <br />
                                                </li>
                                            </ul>
                                        </Typography>
                                    </Fragment>
                                }>
                                    <HelpOutlineIcon />
                                </HtmlTooltip>
                            </Box>
                            <EventFields
                                name={name} setName={setName}
                                description={description} setDescription={setDescription}
                                image={image} setImage={handleChangeImage}
                                startDate={startDate} setStartDate={setStartDate}
                                endDate={endDate} setEndDate={setEndDate}
                                errorHandler={errorHandler}
                            />
                        </Fragment>
                    )}
                    {currentMenu === 1 && (
                        <SetProductDiscounts
                            discountedProducts={discountedProducts}
                            setDiscountedProducts={setDiscountedProducts}
                            errorHandler={errorHandler}
                        />
                    )}
                    {currentMenu === 2 && (
                        <SearchProducts
                            productName={productName}
                            setProductName={setProductName}
                            searchResults={searchResults}
                            pageCount={pageCount}
                            page={page}
                            handlePageChange={handlePageChange}
                            sku={sku}
                            setSku={setSku}
                            categoryChoices={categoryChoices}
                            categories={categories}
                            setCategories={setCategories}
                            discountedProducts={discountedProducts}
                            handleChangeChecked={handleChangeChecked}
                            applyFilters={getSearchResults}
                        />
                    )}
                    <Box sx={{ my: 2 }}>
                        <Button variant="contained" onClick={updateEvent}>
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Box>

        </Box>
    )
}