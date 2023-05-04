import React, { HTMLAttributes } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { useColorMode } from '@chakra-ui/react';
import ja from 'date-fns/locale/ja'; // the locale you want
import 'react-datepicker/dist/react-datepicker.css';
import './date-picker.css';
import { AiOutlineCalendar } from 'react-icons/ai';

registerLocale('ja', ja);

interface Props {
  isClearable?: boolean;
  onChange: (date: Date) => any;
  selectedDate: Date | undefined;
  showPopperArrow?: boolean;
  containerStyle: React.HtmlHTMLAttributes<HTMLDivElement>;
}

const DatePicker = ({
  selectedDate,
  onChange,
  isClearable = false,
  showPopperArrow = false,
  containerStyle = {},
  ...props
}: Props & HTMLAttributes<HTMLElement>) => {
  const isLight = useColorMode().colorMode === 'light'; // you can check what theme you are using right now however you want
  return (
    // if you don't want to use chakra's colors or you just wwant to use the original ones,
    // set className to "light-theme-original" ↓↓↓↓
    <div
      className={isLight ? 'light-theme' : 'dark-theme'}
      style={{
        position: 'relative',
        ...containerStyle,
      }}
    >
      <ReactDatePicker
        locale={'ja'}
        selected={selectedDate}
        onChange={onChange}
        isClearable={isClearable}
        showPopperArrow={showPopperArrow}
        dateFormat='yyyy/MM/dd (eee)'
        className='react-datapicker__input-text' // input is white by default and there is no already defined class for it so I created a new one
        {...props}
      />
      <AiOutlineCalendar
        style={{
          fontSize: 20,
          position: 'absolute',
          left: 20,
          right: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#C6D5EB',
          zIndex: 99999
        }}
      />
    </div>
  );
};

export default DatePicker;
