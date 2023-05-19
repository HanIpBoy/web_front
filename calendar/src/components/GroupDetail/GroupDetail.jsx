import React from 'react';
import FullCalendar from '@fullcalendar/react';
import Header from '../Header/Header';
import timeGridPlugin from '@fullcalendar/timegrid';
import koLocale from '@fullcalendar/core/locales/ko';
import { useRef, useState, useEffect } from 'react';
import { COLOR_CODE_LIST } from '../../constants';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import CalendarModal from '../Modals/CalendarModal';
import Avatar from '../Avatar';
import GroupItem from '../Group/GroupItem';
import GroupScheduleModal from '../Modals/GroupScheduleModal';
import axios from '../../axios.js';

export default function GroupDetail({ group, groupSchedule, groupUserSchedule }) {
    const calendarRef = useRef();
    const [events, setEvents] = useState([]);
    const [range, setRange] = useState();
    const [open, setOpen] = useState(false); // true면 모달 열림, false면 모달 닫힘
    const [listOpen, setListOpen] = useState(false) // groupname을 눌렀을 때 모달 띄우기
    const [groupMode, setGroupMode] = useState(false) //그룹 일정 추가 모달을 띄울지 일정 추가 모달을 띄울지 결정
    const [editMode, setEditMode] = useState(false) //수정모드

    const handleClickGroupSchedule = () => {
        setGroupMode(true)
        setOpen(true)
    }

    const handleSubmitSchedule = () => { //그룹 일정 추가 눌렀을 때 핸들러
        // const payload = { //서버의 /group/schedule로 보내는 페이로드
        //     groupOriginKey: ,
        //     name: ,
        //     startAt: ,
        //     endAt: ,
        //     memo: ,
        //     allDayToggle: ,
        //     color: 
        // }

        // let response

        // if (editMode) { //수정할 경우
        //     response = await axios.put('/group/schedule', payload)
        // } else { //수정이 아닐 경우
        //     response = await axios.post('/group', payload)
        // }

        // if (response.data.status === 'succeed') { //서버 응답 성공시 onSubmitGroupSchedule 실행
        //     onSubmitGroupSchedule(response.data.data)
        // }
    }

    const handleClickGroupName = () => {
        setListOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setListOpen(false)
    };

    useEffect(() => {
        function updateRange() {
            if (calendarRef.current) {
                const currentRange = calendarRef.current.calendar.currentData.dateProfile.currentRange;
                setRange(currentRange);
            }
        }

        document
            .querySelectorAll('.fc-toolbar-chunk button')
            .forEach((el) => el.addEventListener('click', updateRange));
        updateRange();
    }, []);

    useEffect(() => {
        const events = groupUserSchedule.map((value, userIdx) => { //포맷한 groupSchedules의 그룹스케줄
            const userId = value.userId

            const groupEvents = value.groupSchedules.map((value) => {
                const schedule = { ...value, userId }
                let isGroupColor = schedule.groupOriginKey === group.originKey
                let event = {
                    id: schedule.originKey,
                    start: schedule.startAt,
                    end: schedule.endAt,
                    allDay: schedule.allDayToggle === "true",
                    backgroundColor: isGroupColor ? 'white' : COLOR_CODE_LIST[userIdx],
                    borderColor: isGroupColor ? 'black' : COLOR_CODE_LIST[userIdx]
                }
                return event
            })

            const userEvents = value.userSchedules.map((value) => { //포맷한 groupSchedule의 유저스케줄
                const schedule = { ...value, userId }
                let event = {
                    id: schedule.originKey,
                    start: schedule.startAt,
                    end: schedule.endAt,
                    allDay: schedule.allDayToggle,
                    backgroundColor: COLOR_CODE_LIST[userIdx],
                    borderColor: COLOR_CODE_LIST[userIdx]
                }
                return event
            })
            return [...groupEvents, ...userEvents]
        })
        setEvents(...events)
        console.log(...events)

    }, [groupUserSchedule]);



    return (
        <>
            {open &&
                <CalendarModal
                    //   selectedSchedule={selectedSchedule}
                    //   selectedDate={selectedDate}
                    //
                    groupMode={groupMode}
                    onClickGroupSchedule={handleClickGroupSchedule}
                    onClose={handleClose}
                    onSubmitGroupSchedule={handleSubmitSchedule}
                />
            }
            {listOpen &&
                <GroupScheduleModal
                    onClickGroupName={handleClickGroupName}
                    onClose={handleClose}
                    groupSchedule={groupSchedule}
                />

            }
            <Header />
            <div style={{
                backgroundColor: 'rgba(219,230,243,0.5)',
                height: 'auto',
                marginLeft: '15%',
                marginRight: '15%',
                marginBottom: '50px',
                padding: '35px 50px',
                borderRadius: '30px',
                boxShadow: '2px 2px 10px rgba(0,0,0,0.2)',
                fontFamily: 'var(--font-PoorStory);'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        {/* TODO: group.name -> {group.name} 으로 변경하기 */}
                        <Button variant='contained' onClick={handleClickGroupName} style={{ marginBottom: '10px', fontSize: '18px' }}>group.groupName</Button>
                    </div>
                    <Button variant="text" sx={{ fontWeight: 'bold', fontSize: '18px' }} onClick={handleClickGroupSchedule}>그룹 일정 추가</Button>
                </div>
                <Box sx={style}>
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[timeGridPlugin]}
                        initialView='timeGridWeek'
                        locale={koLocale}
                        events={events}
                        displayEventTime={false}
                        eventOverlap={false}
                        eventClassNames={'custom-event'}
                        eventOrder={(a, b) => a.order - b.order}
                        allDaySlot={false}
                        height={'600px'}
                    />
                </Box>
            </div>
        </>
    );
}

const style = {
    '.custom-event': {
        width: '10px !important'
    },
};
