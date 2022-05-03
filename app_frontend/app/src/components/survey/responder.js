import { format } from 'date-fns';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
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

export const RespondersSurvey = (props) => {
  const {surveys, signeraddress} = props
  const filteredSurveys = surveys.filter(survey => {
    if (survey.owner !== null && signeraddress !== null) {
      return survey.owner.toLowerCase() !== signeraddress.toLowerCase() 
    }
  })

  return (<Card {...props}>
    <CardHeader title="Latest Orders" />
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
              </TableRow> 
            ))}
          </TableBody>
        </Table>
      </Box>
    </PerfectScrollbar>
    {/* <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        p: 2
      }}
    >
      <Button
        color="primary"
        endIcon={<ArrowRightIcon fontSize="small" />}
        size="small"
        variant="text"
      >
        View all
      </Button>
    </Box> */}
  </Card>)
};
