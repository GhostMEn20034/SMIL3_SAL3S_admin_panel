import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';

import { dealCreateMenuItems } from "../../utils/consts";
import useAxios from "../../utils/useAxios";
import MenusNavigation from "../../components/CreateProduct/MenusNavigation";
import UpdateDealForm from "../../components/Deals/UpdateDeal/UpdateDealForm";
import DealFilterEditor from "../../components/Deals/DealFilterEditor";
import { encodeOneImage } from "../../utils/ImageServices";
import ObjectValueExtractor from "../../utils/objectValueExtractor";
import DeleteDealDialog from "../../components/Deals/DeleteDealDialog";

export default function UpdateDealPage() {
    const [dealData, setDealData] = useState(null);
    const [isParent, setIsParent] = useState(false);
    const [description, setDescription] = useState(null);
    const [image, setImage] = useState(null);
    const [otherFilters, setOtherFilters] = useState(null);
    const [creationEssentials, setCreationEssentials] = useState({});
    const [currentMenu, setCurrentMenu] = useState(0);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [errorHandler, setErrorHandler] = useState(new ObjectValueExtractor({}, false));
    const [currentDialog, setCurrentDialog] = useState(null);
    const [errorDeletion, setErrorDeletion] = useState(null);

    const navigate = useNavigate();
    const api = useAxios('products');

    const { id } = useParams(); // product id parameter

    const getDealCreationEssentials = async () => {
        try {
            let params = {};
            if (dealData?.category_id) {
                params["facet_category"] = dealData?.category_id;
            }
            let response = await api.get("/admin/deals/create", { params: params });
            let data = await response.data;
            setCreationEssentials(data);
        } catch (e) {
            console.log("Something Went Wrong");
        }
    };


    const getDealById = async () => {
        setLoading(true);
        try {
            let response = await api.get(`/admin/deals/${id}`);
            let data = await response.data;
            let { is_parent, image, other_filters, description, ...deal_data } = data.deal;

            setDealData(deal_data);
            setIsParent(is_parent);
            setDescription(description);
            setImage(image);
            setOtherFilters(other_filters);
        } catch (e) {
            if (e.response.data.status === 404) {
                navigate(-1);
            }

            console.log("Something went wrong");
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

        if (key === 'category_id') {
            setOtherFilters(null);
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
                description: description?.length > 0 ? description : null,
                is_parent: isParent,
                image: encodedImage,
                other_filters: otherFilters,
            };

            await api.put(`/admin/deals/${id}`, body);
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

    const deleteDeal = async () => {
        try {
            await api.delete(`/admin/deals/${id}`);
            navigate(-1);
        } catch (e) {
            setErrorDeletion(e.response.data.detail);
        }
    };

    useEffect(() => {
        getDealById();
    }, []);

    useEffect(() => {
        getDealCreationEssentials();
    }, [dealData?.category_id]);


    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {currentDialog === 'deleteDeal' && (
                <DeleteDealDialog
                    open={currentDialog === 'deleteDeal'}
                    setOpen={setCurrentDialog}
                    name={dealData.name}
                    handleSubmit={deleteDeal}
                    error={errorDeletion}
                    setError={setErrorDeletion}
                />
            )}
            <Box display="flex">
                <Box sx={{ ml: 3, mt: 3 }}>
                    <Typography variant="h4">
                        Update Deal
                    </Typography>
                    <Button variant="contained" sx={{ mt: 1 }} color="warning" onClick={() => navigate(-1)}>
                        Go back
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ mt: 1, ml: 2 }}
                        color="error"
                        onClick={() => setCurrentDialog("deleteDeal")}
                    >
                        Delete Deal
                    </Button>
                </Box>
                <Box>
                    <Box sx={{ ml: 25, mt: 5 }}>
                        <MenusNavigation value={currentMenu}
                            setValue={setCurrentMenu}
                            labels={dealCreateMenuItems}
                            disabledButtonIndexes={[isParent ? 1 : null]} />
                    </Box>
                </Box>
            </Box>
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ mt: 3 }}>
                <Box>
                    {currentMenu === 0 && dealData && (
                        <>
                            <UpdateDealForm
                                dealData={dealData}
                                handleChangeDealData={handleChangeDealData}
                                description={description}
                                setDescription={(newValue) => setDescription(newValue?.length > 0 ? newValue : null)}
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