import { Box, Typography, TextField, IconButton, Button, Alert } from "@mui/material";
import MultipleSelect from "../MultipleSelectValue";
import SelectValue from "../SelectValue";
import { Fragment, useState } from "react";
import RemoveIcon from '@mui/icons-material/Remove';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import slugify from "voca/slugify";

export default function ChooseVarThemeForm(props) {
  /**
   * A component for choosing product's variation theme
   * Params:
   * @param props.variationTheme - current variation theme
   * @param props.facets - list of facets;
   * @param props.variationThemes - list of templates for variation theme creation
   * @param props.handleSubmit - function that executes on submit
   */

  // chosen template
  const [chosenTemplate, setChosenTemplate] = useState(null);

  // Variation theme name
  const [name, setName] = useState(
    props.variationTheme?.name ?
      props.variationTheme?.name : ""
  );

  // Variation theme options
  const [options, setOptions] = useState(
    props.variationTheme?.options ?
      props.variationTheme?.options : [{ name: "", field_codes: [] }]
  );

  const changeFilterName = (value, indexTarget) => {
    let newFilters = options.map((varOption, index) => {
      if (index === indexTarget) {
        return {
          ...varOption,
          name: value
        };
      } else {
        return varOption;
      }
    });

    setOptions(newFilters);
  };

  const changeFieldCodes = (value, indexTarget) => {
    let newFilters = options.map((varOption, index) => {
      if (index === indexTarget) {

        return {
          ...varOption,
          field_codes: value
        };

      } else {
        return varOption;
      }
    });
    setOptions(newFilters);
  };

  const removeFilter = (indexTarget) => {
    setOptions(prevFilter => {

      // Make a copy of the previous array
      const newArr = [...prevFilter];

      // Remove one element starting from indexTarget
      newArr.splice(indexTarget, 1);

      if (newArr.length > 0) {
        // Return the new array
        return newArr
      }

      return [{ name: "", field_codes: [] }]

    })
  };

  const addFilter = () => {
    setOptions([...options, { name: "", field_codes: [] }]);
  };

  const chooseVarThemeTemplate = (id) => {
    if (!id) {
      setChosenTemplate(null);

      return;
    }
    setChosenTemplate(id);
    let template = props.variationThemes.find(varTheme => varTheme._id === id);

    setName(template.name);
    setOptions(template.filters)
  };

  return (
    <Box>
      <Typography variant="body1" sx={{ mb: 1 }}>
        <b>Note that after variation theme update, <br /> all products in "Product Variation" section will be deleted</b>
      </Typography>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Variation theme template (OPTIONAL):
      </Typography>
      <Box>
        <SelectValue value={chosenTemplate ? chosenTemplate : ""}
          objectKey={"_id"} setValue={chooseVarThemeTemplate}
          menuItems={[{ "_id": null, "name": "No template" }, ...props.variationThemes]}
          otherProps={{ minWidth: 222 }}
        />
      </Box>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Variation theme name:
      </Typography>
      <Box>
        <TextField size={"small"}
          label="Name" value={name}
          onChange={(e) => setName(slugify(e.target.value))}
          error={props.errorHandler?.isValueExist("variation_theme", "name")}
          helperText={props.errorHandler?.getObjectValue("variation_theme", "name")}
        />
      </Box>
      <Box>
        <Typography variant="h6">
          Variation theme Options:
        </Typography>

        <Box>
          <Box sx={{ pb: 2 }}>
            {options.map((option, optionIndex) => (
              <Fragment key={optionIndex}>
                <Box display={"flex"}>
                  <Box sx={{ boxShadow: 2, padding: 3, mt: 2, backgroundColor: "#fcfcf0", borderRadius: "20px" }}>

                    <Box sx={{ mt: optionIndex === 0 ? 1 : 2 }}>
                      <TextField
                        size={"small"}
                        label={"Option name"}
                        value={option.name}
                        onChange={(e) => changeFilterName(e.target.value, optionIndex)}
                        error={props.errorHandler?.isValueExist("variation_theme", "options", optionIndex, "name")}
                        helperText={props.errorHandler?.getObjectValue("variation_theme", "options", optionIndex, "name")}
                      />

                    </Box>
                    <Typography variant="subtitle2" sx={{ mt: 1, fontSize: 16, mb: 1 }}>
                      Field codes:
                    </Typography>
                    {props.facets?.length > 0 && (
                      <MultipleSelect
                        value={option.field_codes}
                        setValue={changeFieldCodes}
                        objectKey={"code"}
                        objectValue={"name"}
                        menuItems={props.facets}
                        label={"Field codes"}
                        index={optionIndex}
                      />
                    )}
                    {props.errorHandler?.isValueExist("variation_theme", "options", optionIndex, "field_codes") && (
                      <Alert severity="error" sx={{mt: 2}}>
                         {props.errorHandler?.getObjectValue("variation_theme", "options", optionIndex, "field_codes")}
                      </Alert>
                    )}
                  </Box>

                  <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ ml: 6 }}>
                    <IconButton onClick={() => removeFilter(optionIndex)}>
                      <RemoveIcon />
                    </IconButton>
                    <IconButton onClick={() => addFilter()}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Fragment>
            ))}
          </Box>

        </Box>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => props.handleSubmit({ name: name, options: options })}>
          Submit
        </Button>
      </Box>
    </Box>
  );
}