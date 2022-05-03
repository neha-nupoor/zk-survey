import { useState } from 'react';
import { format } from 'date-fns';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip
} from '@mui/material';

import { SeverityPill } from '../severity-pill';
import ConfirmationDialogRaw from "./respond-survey";

export const OwnerSurvey = (props) => {
  const {surveys, signeraddress} = props
  const filteredSurveys = surveys.filter(survey => {
    if (survey.owner !== null && signeraddress !== null) {
      return survey.owner.toLowerCase() === signeraddress.toLowerCase() 
    }
  })

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();

  const handleClickOpenDialog = () => {
    setOpen(true);
  };

  const handleClose = (newValue) => {
    setOpen(false);

    if (newValue) {
      setValue(newValue);
    }
  };

  return (<Card {...props}>
    <CardHeader title="Surveys Created" />
    <PerfectScrollbar>
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Survey Title
              </TableCell>
              <TableCell>
                NPS Score
              </TableCell>
              <TableCell sortDirection="desc">
                <Tooltip
                  enterDelay={300}
                  title="Sort"
                >
                  <TableSortLabel
                    active
                    direction="desc"
                  >
                    Creation Date
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell>
                Status
              </TableCell>
              <TableCell>
                Expiry Date
              </TableCell>
              <TableCell>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSurveys.map((survey) => (
              <TableRow
                hover
                key={survey._id}
              >
                <TableCell>
                  {survey.title}
                </TableCell>
                <TableCell>
                  {survey.npsScore}
                </TableCell>
                <TableCell>
                  {format(new Date(survey.createdAt), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  <SeverityPill
                    color={(survey.expiryLabel === 1 && 'success')
                    || (survey.expiryLabel === -1 && 'error')
                    || 'warning'}
                  >
                    {survey.expiryLabel === -1 ? 'Expired' : 'Valid' }
                  </SeverityPill>
                </TableCell>
                <TableCell>
                  {format(new Date(survey.expiry), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  <Button variant="contained" disabled={survey.expiryLabel === -1} onClick={handleClickOpenDialog}> Respond</Button>
                </TableCell>
                <ConfirmationDialogRaw
                  id={survey._id}
                  keepMounted
                  open={open}
                  onClose={handleClose}
                  value={value}
                  survey={survey}
                />
              </TableRow> 
            ))}
          </TableBody>
        </Table>
      </Box>
    </PerfectScrollbar>
  </Card>)
};
