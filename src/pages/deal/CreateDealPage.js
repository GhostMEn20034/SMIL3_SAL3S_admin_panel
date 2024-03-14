import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';

import { dealCreateMenuItems } from "../../utils/consts";
import useAxios from "../../utils/useAxios";
import MenusNavigation from "../../components/CreateProduct/MenusNavigation";
import AddDealForm from "../../components/Deals/AddDeal/AddDealForm";
import DealFilterEditor from "../../components/Deals/DealFilterEditor";
import { encodeOneImage } from "../../utils/ImageServices";
import ObjectValueExtractor from "../../utils/objectValueExtractor";

export default function CreateDealPage() {
    const [dealData, setDealData] = useState({
        name: null,
        parent_id: null,
        is_visible: true,
        query: null,
        price_min: null,
        price_max: null,
        category_id: null,
    });
    const [isParent, setIsParent] = useState(false);
    const [image, setImage] = useState(null);
    const [otherFilters, setOtherFilters] = useState(null);
    const [creationEssentials, setCreationEssentials] = useState({});
    const [currentMenu, setCurrentMenu] = useState(0);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [errorHandler, setErrorHandler] = useState(new ObjectValueExtractor({}, false));

    const navigate = useNavigate();
    const api = useAxios('products');

    const getDealCreationEssentials = async () => {
        setLoading(true);
        try {
            let params = {};
            if (dealData.category_id) {
                params["facet_category"] = dealData.category_id;
            }
            let response = await api.get("/admin/deals/create", { params: params });
            let data = await response.data;
            setCreationEssentials(data);
            setOtherFilters(null);
        } catch (e) {
            console.log("Something Went Wrong");
        }
        setLoading(false);
    };

    const handleChangeImage = (e) => {
        let files = e.target.files;

        if (files.length > 0) {
            let newImage = files[0];
            // assign url to the image
            newImage.url = URL.createObjectURL(newImage);
            setImage(newImage);
        };
    };

    const handleChangeDealData = (key, value) => {
        if (!(typeof value === 'boolean') && !value) {
            value = null;
        }

        setDealData((prevValues) => {
            return { ...prevValues, [key]: value };
        });
    };

    const deleteOtherFilter = (index) => {
        setOtherFilters((prevValues) => {
            if (prevValues) {
                let modifiedOtherFilters = prevValues.filter((_, i) => i !== index);
                if (modifiedOtherFilters?.length < 1) {
                    return null;
                }
                return modifiedOtherFilters;
            }
            return prevValues;
        });
    };

    const handleSubmit = async () => {
        setSubmitLoading(true);
        try {
            let encodedImage = await encodeOneImage(image);

            let body = {
                ...dealData,
                is_parent: isParent,
                image: encodedImage,
                other_filters: otherFilters,
            }
            await api.post("/admin/deals/create", body);
            navigate(-1);
        } catch (err) {
            let baseErrors = err.response.data?.base_errors;
            setErrorHandler(() => {
                console.log(err.response.data);
                if (baseErrors) {
                    return new ObjectValueExtractor(err.response.data.errors, true);
                } else {
                    return new ObjectValueExtractor(err.response.data.detail, false);
                }
            });
        }
        setSubmitLoading(false);
    };


    useEffect(() => {
        getDealCreationEssentials();
    }, [dealData.category_id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box display="flex">
                <Box sx={{ ml: 3, mt: 3 }}>
                    <Typography variant="h4">
                        Add Deal
                    </Typography>
                    <Button variant="contained" sx={{ mt: 1 }} color="warning" onClick={() => navigate(-1)}>
                        Go back
                    </Button>
                </Box>
                <Box>
                    <Box sx={{ ml: 25, mt: 5 }}>
                        <MenusNavigation value={currentMenu}
                            setValue={setCurrentMenu}
                            labels={dealCreateMenuItems}
                            disabledButtonIndexes={[]} />
                    </Box>
                </Box>
            </Box>
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ mt: 3 }}>
                <Box>
                    {currentMenu === 0 && (
                        <>
                            <AddDealForm
                                dealData={dealData}
                                handleChangeDealData={handleChangeDealData}
                                image={image}
                                setImage={handleChangeImage}
                                isParent={isParent}
                                setIsParent={setIsParent}
                                categoryChoices={creationEssentials.categories}
                                parentDeals={creationEssentials.parent_deals}
                                errorHandler={errorHandler}
                            />
                            <LoadingButton
                                loading={submitLoading}
                                variant="contained"
                                sx={{ my: 2 }}
                                onClick={handleSubmit}
                            >
                                Submit
                            </LoadingButton>
                        </>
                    )}
                    {currentMenu === 1 && (
                        <DealFilterEditor
                            facets={creationEssentials.facets}
                            otherFilters={otherFilters ? otherFilters : []}
                            setOtherFilters={setOtherFilters}
                            deleteOtherFilter={deleteOtherFilter}
                            errorHandler={errorHandler}
                        />
                    )}
                </Box>
            </Box>
        </Box>
    );
}