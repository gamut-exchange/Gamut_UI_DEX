import { AccordionActions, AccordionDetails, AccordionSummary, Paper, Accordion, styled } from '@mui/material'
import React, {useState} from 'react'

// accordian start
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CreateSimpleSwitcher } from "./ChartHome";
// accordian close



function History() {
      // ACCORDIAN START
  const [expanded, setExpanded] = React.useState("panel1");
  const [grayColor,setGrayColor]=useState("#6d6d7d");
  const [darkFontColorSec, setDarkFontColorSec] = useState("#13a8ff");


  const handleAccord = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // ACCORDIAN CLOSE

//   ITEM START 
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
//   ITEM CLOSE 



  return (
    <>
    <Item sx={{ pl: 3, pr: 3,pb:2,pt:3 }} style={{ backgroundColor: "#12122c",textAlign:"left",borderRadius:"10px" }} className="history">
            <span style={{ textAlign: "start", color: "white" }}>History:</span>

            <div style={{ float: "right", display: "inline" }}>
              <span style={{ textAlign: "right", color: "white" }}>search</span>
            </div>
            <hr></hr>

        
            {/* ACCORDIAN SART  */}

            <Accordion
              sx={{minHeight:"20px" }}
              expanded={expanded === "panel1"}
              onChange={handleAccord("panel1")}
              style={{ backgroundColor: "#12122c", color: "white" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                style={{marginTop:"0px"}}
                sx={{ m: 0,pb: 0, pr:0,mt: 0,mb: 0,pt: 0,pl:0}}
              >
                <div style={{width:"100%"}}>
                <div style={{ float: "left" }}>
                  <span style={{ textAlign: "start", color: "white" }}>
                    Swap USDC | DAI:
                  </span>
                </div>
                <div style={{ float: "right", display: "inline" }}>
                  <span
                    style={{
                      textAlign: "right",
                      color: "white",
                      float:"right"
                    }}
                  >
                    03/10/22 08:32
                  </span>
                </div>
                </div>
              </AccordionSummary>
              <AccordionDetails sx={{pt:0,pl: 0}}>
                <div>
                  <span style={{ textAlign: "start", color: grayColor, fontSize:"12px" }}>
                    From:
                  </span>

                  <div style={{ float: "right", display: "inline" }}>
                    <span style={{ textAlign: "right", color: grayColor, fontSize:"12px" }}>
                      1200 USDC
                    </span>
                  </div>
                </div>

                <div>
                  <span style={{ textAlign: "start", color: grayColor, fontSize:"12px" }}>
                    To:
                  </span>

                  <div style={{ float: "right", display: "inline" }}>
                    <span style={{ textAlign: "right", color: grayColor, fontSize:"12px" }}>
                      1220 DAI
                    </span>
                  </div>
                </div>

                <div>
                  <span style={{ textAlign: "start", color: grayColor, fontSize:"12px" }}>
                    Price:
                  </span>

                  <div style={{ float: "right", display: "inline" }}>
                    <span style={{ textAlign: "right", color: grayColor, fontSize:"12px" }}>
                      1 USDC = 1.001 DAI{" "}
                    </span>
                  </div>
                </div>

                <div>
                  <span style={{ textAlign: "start", color: grayColor, fontSize:"12px" }}>
                    Transaction:
                  </span>

                  <div style={{ float: "right", display: "inline" }}>
                    <span style={{ textAlign: "right", color: darkFontColorSec, fontSize:"12px" }}>
                      0*8047857...589
                    </span>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            {/* ACCORDIAN CLOSE  */}

            

            {/* ACCORDIAN SART  */}

            <Accordion
              sx={{minHeight:"20px" }}
              expanded={expanded === "panel2"}
              onChange={handleAccord("panel2")}
              style={{ backgroundColor: "#12122c", color: "white",borderRadiu: "10px" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                style={{marginTop:"0px"}}
                sx={{ m: 0,pb: 0, pr:0,mt: 0,mb: 0,pt: 0,pl:0}}
              >
                <div style={{width:"100%"}}>
                <div style={{ float: "left" }}>
                  <span style={{ textAlign: "start", color: "white" }}>
                    Swap USDC | DAI:
                  </span>
                </div>
                <div style={{ float: "right", display: "inline" }}>
                  <span
                    style={{
                      textAlign: "right",
                      color: "white",
                      float:"right"
                    }}
                  >
                    03/10/22 08:32
                  </span>
                </div>
                </div>
              </AccordionSummary>
              <AccordionDetails sx={{pt:0,pl: 0}}>
                <div>
                  <span style={{ textAlign: "start", color: grayColor, fontSize:"12px" }}>
                    From:
                  </span>

                  <div style={{ float: "right", display: "inline" }}>
                    <span style={{ textAlign: "right", color: grayColor, fontSize:"12px" }}>
                      1200 USDC
                    </span>
                  </div>
                </div>

                <div>
                  <span style={{ textAlign: "start", color: grayColor, fontSize:"12px" }}>
                    To:
                  </span>

                  <div style={{ float: "right", display: "inline" }}>
                    <span style={{ textAlign: "right", color: grayColor, fontSize:"12px" }}>
                      1220 DAI
                    </span>
                  </div>
                </div>

                <div>
                  <span style={{ textAlign: "start", color: grayColor, fontSize:"12px" }}>
                    Price:
                  </span>

                  <div style={{ float: "right", display: "inline" }}>
                    <span style={{ textAlign: "right", color: grayColor, fontSize:"12px" }}>
                      1 USDC = 1.001 DAI{" "}
                    </span>
                  </div>
                </div>

                <div>
                  <span style={{ textAlign: "start", color: grayColor, fontSize:"12px" }}>
                    Transaction:
                  </span>

                  <div style={{ float: "right", display: "inline" }}>
                    <span style={{ textAlign: "right", color: darkFontColorSec, fontSize:"12px" }}>
                      0*8047857...589
                    </span>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            {/* ACCORDIAN CLOSE  */}

             {/* ACCORDIAN SART  */}

             <Accordion
              sx={{minHeight:"20px" }}
              expanded={expanded === "panel3"}
              onChange={handleAccord("panel3")}
              style={{ backgroundColor: "#12122c", color: "white" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                style={{marginTop:"0px"}}
                sx={{ m: 0,pb: 0, pr:0,mt: 0,mb: 0,pt: 0,pl:0}}
              >
                <div style={{width:"100%"}}>
                <div style={{ float: "left" }}>
                  <span style={{ textAlign: "start", color: "white" }}>
                    Swap USDC | DAI:
                  </span>
                </div>
                <div style={{ float: "right", display: "inline" }}>
                  <span
                    style={{
                      textAlign: "right",
                      color: "white",
                      float:"right"
                    }}
                  >
                    03/10/22 08:32
                  </span>
                </div>
                </div>
              </AccordionSummary>
              <AccordionDetails sx={{pt:0,pl: 0}}>
                <div>
                  <span style={{ textAlign: "start", color: grayColor, fontSize:"12px" }}>
                    From:
                  </span>

                  <div style={{ float: "right", display: "inline" }}>
                    <span style={{ textAlign: "right", color: grayColor, fontSize:"12px" }}>
                      1200 USDC
                    </span>
                  </div>
                </div>

                <div>
                  <span style={{ textAlign: "start", color: grayColor, fontSize:"12px" }}>
                    To:
                  </span>

                  <div style={{ float: "right", display: "inline" }}>
                    <span style={{ textAlign: "right", color: grayColor, fontSize:"12px" }}>
                      1220 DAI
                    </span>
                  </div>
                </div>

                <div>
                  <span style={{ textAlign: "start", color: grayColor, fontSize:"12px" }}>
                    Price:
                  </span>

                  <div style={{ float: "right", display: "inline" }}>
                    <span style={{ textAlign: "right", color: grayColor, fontSize:"12px" }}>
                      1 USDC = 1.001 DAI{" "}
                    </span>
                  </div>
                </div>

                <div>
                  <span style={{ textAlign: "start", color: grayColor, fontSize:"12px" }}>
                    Transaction:
                  </span>

                  <div style={{ float: "right", display: "inline" }}>
                    <span style={{ textAlign: "right", color: darkFontColorSec, fontSize:"12px" }}>
                      0*8047857...589
                    </span>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>

            {/* ACCORDIAN CLOSE  */}
          </Item>
    </>
  )
}

export default History