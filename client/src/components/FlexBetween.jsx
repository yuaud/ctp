import { Box } from "@mui/material";
import { styled } from "@mui/system";

/* Reusing css as a component 
this is essentially a style component
we are creating this because we are going to use this a lot*/
const FlexBetween = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export default FlexBetween;
