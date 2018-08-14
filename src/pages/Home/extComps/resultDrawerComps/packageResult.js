import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider,
  Tooltip,
} from 'material-ui';
import {Search} from 'material-ui-icons';

const PackageResult = (props) => {
  const {
    allReducer,
    classes,
    packageValue,
    handlePackageChange,
    packageItem,
    handleDrawer,
    resultDrawerLabel,
  } = props;
  return resultDrawerLabel.map(
    (label, index) =>
      index === 0 ? (
        <div key={index}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="package-length">{`${
              allReducer.length
            } Package (s)`}</InputLabel>
            <Select value={packageValue} onChange={handlePackageChange}>
              {allReducer.length > 0 ? (
                allReducer.map((item, index) => (
                  <MenuItem
                    value={item}
                    classes={{root: classes.menuItem}}
                    key={index}
                  >
                    <div key={index}>
                      <p style={{fontSize: 16}}>
                        To:<strong>
                          {item.package.DestinationData.namaPenerima}
                        </strong>{' '}
                        | {item.package.DestinationData.kodeTo}
                      </p>
                      <p>
                        {item.package.OtherInfoData.service} | Rp.{' '}
                        {item.package.Total}
                      </p>
                    </div>
                  </MenuItem>
                ))
              ) : (
                <MenuItem>You have no package</MenuItem>
              )}
            </Select>
          </FormControl>
          <Tooltip
            id="tooltip-left-end"
            title="Search Post & Tariff Code"
            placement="left-end"
          >
            <IconButton
              onClick={() => handleDrawer('openSearchDrawer')}
              className={classes.resultSearchBtn}
            >
              <Search />
            </IconButton>
          </Tooltip>
        </div>
      ) : (
        ''
      ),
  );
};
export default PackageResult;
