import React, { useContext } from "react";
import { DiamondContext } from "../DiamondGridContext/DiamondGridContext";
import { FormControl, FormControlLabel, Checkbox, FormGroup } from "@mui/material";

const MetalTypeCheckboxes = () => {
  const { metalTypeData, handleCheckboxChange, resetFields } = useContext(DiamondContext);

  return (
    <FormControl className="" component="fieldset" style={{ display: "flex", justifyContent: "flex-end" }}>
      <FormGroup row>
        <FormControlLabel className="checked"
          control={
            <Checkbox
              checked={metalTypeData.gold}
              onChange={handleCheckboxChange}
              name="gold"
              color="primary"
            />
          }
          label="Gold"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={metalTypeData.platinum}
              onChange={handleCheckboxChange}
              name="platinum"
              color="primary"
            />
          }
          label="Platinum"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={metalTypeData.diamond}
              onChange={handleCheckboxChange}
              name="diamond"
              color="primary"
            />
          }
          label="Diamond"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={metalTypeData.colorstone}
              onChange={handleCheckboxChange}
              name="colorstone"
              color="primary"
            />
          }
          label="Colorstone"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={metalTypeData.wastage}
              onChange={handleCheckboxChange}
              name="wastage"
              color="primary"
            />
          }
          label="Wastage"
        />{metalTypeData.diamond &&
          <>
            <FormControlLabel
              control={
                <Checkbox
                  checked={metalTypeData.handlingCharges}
                  onChange={handleCheckboxChange}
                  name="handlingCharges"
                  color="primary"
                />
              }
              label="Handling Charges"
            />
          </>
        }

      </FormGroup>

    </FormControl>
  );
};

export default MetalTypeCheckboxes;
