// @mui material components
// import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
// import MDAvatar from "components/MDAvatar";
// import MDProgress from "components/MDProgress";

// // Images
// import logoXD from "assets/images/small-logos/logo-xd.svg";
// import logoAtlassian from "assets/images/small-logos/logo-atlassian.svg";
// import logoSlack from "assets/images/small-logos/logo-slack.svg";
// import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
// import logoJira from "assets/images/small-logos/logo-jira.svg";
// import logoInvesion from "assets/images/small-logos/logo-invision.svg";
// import team1 from "assets/images/team-1.jpg";
// import team2 from "assets/images/team-2.jpg";
// import team3 from "assets/images/team-3.jpg";
// import team4 from "assets/images/team-4.jpg";

export default function data() {
  const handleRepeatTransaction = (transactionType, details) => {
    console.log("Repeating transaction:", transactionType, details);
    // Add your repeat transaction logic here
  };

  return {
    columns: [
      { Header: "activity type", accessor: "activityType", width: "15%", align: "left" },
      { Header: "description", accessor: "description", width: "30%", align: "left" },
      { Header: "amount", accessor: "amount", align: "left" },
      { Header: "date", accessor: "date", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: [
      {
        activityType: (
          <MDTypography variant="caption" color="info" fontWeight="medium">
            Savings
          </MDTypography>
        ),
        description: [
          "Savings For December Trip",

        ],
        amount: "₦50,000",
        date: "2023-10-08",
        status: (
          <MDBox ml={-1}>
            <MDTypography variant="caption" color="success" fontWeight="medium">
              Completed
            </MDTypography>
          </MDBox>
        ),
        action: (
          <MDButton
            variant="text"
            color="info"
            size="small"
            onClick={() => handleRepeatTransaction("savings", { amount: "50000", type: "personal" })}
          >
            <Icon>repeat</Icon>&nbsp;Repeat
          </MDButton>
        ),
      },
      {
        activityType: (
          <MDTypography variant="caption" color="warning" fontWeight="medium">
            Bill Split
          </MDTypography>
        ),
        description: [
          "Dinner with Friends",

        ],
        amount: "₦12,500",
        date: "2023-10-07",
        status: (
          <MDBox ml={-1}>
            <MDTypography variant="caption" color="success" fontWeight="medium">
              Completed
            </MDTypography>
          </MDBox>
        ),
        action: (
          <MDButton
            variant="text"
            color="info"
            size="small"
            onClick={() => handleRepeatTransaction("billsplit", { amount: "12500", group: "dinner-friends" })}
          >
            <Icon>repeat</Icon>&nbsp;Repeat
          </MDButton>
        ),
      },
      {
        activityType: (
          <MDTypography variant="caption" color="primary" fontWeight="medium">
            Group Savings
          </MDTypography>
        ),
        description: [
          "Aso Ebi Wedding Savings"
        ],
        amount: "₦25,000",
        date: "2023-10-06",
        status: (
          <MDBox ml={-1}>
            <MDTypography variant="caption" color="dark" fontWeight="medium">
              Pending
            </MDTypography>
          </MDBox>
        ),
        action: (
          <MDButton
            variant="text"
            color="info"
            size="small"
            onClick={() => handleRepeatTransaction("groupsavings", { amount: "25000", group: "weekend-trip" })}
          >
            <Icon>repeat</Icon>&nbsp;Repeat
          </MDButton>
        ),
      },
      // ... keep other transactions with similar structure
    ],
  };
}