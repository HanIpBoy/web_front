import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function RepeatField({ name, onInput, value }) {

    return (
        <div>
            <FormControl
                variant="filled"
                sx={{ mt: 2, minWidth: 120 }}
                fullWidth
                required
            >
                <InputLabel id="demo-simple-select-filled-label">반복</InputLabel>
                <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    name={name}
                    value={value}
                    onChange={onInput}
                >
                    <MenuItem value="안 함">안 함</MenuItem>
                    <MenuItem value="매일">매일</MenuItem>
                    <MenuItem value="매주">매주</MenuItem>
                    <MenuItem value="매달">매달</MenuItem>
                    <MenuItem value="매년">매년</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}