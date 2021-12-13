import * as  React from 'react'
import HighchartsReact from 'highcharts-react-official'
import * as Highcharts from 'highcharts/highstock'



// export class Radio extends React.Component<any, any> {
//     handleChange = (event) => {
//         const value: number = event.target.checked ? 1 : 0;
//         // this.props.updateHandler(value);
//         console.log("handleChange", value);
//     }
//     render() {
//         return (
//             <div className='radio-group'>
//                 {this.props.options ? this.props.options.map(item =>
//                     <div className='radio'>
//                         <label>
//                             <input
//                                 name={this.props.name + '[]'}
//                                 value={item.value}
//                                 defaultChecked={item.selected}
//                                 type='radio'
//                                 onChange={this.handleChange} />
//                             <span>{item.name}</span>
//                         </label>
//                     </div>) : []}
//             </div>
//         );
//     }
// }
const strings = {
    showButton: 'Показать',
    intervalHint: 'Промежуток',
    intervalLabel: 'Промежуток',
    weekInterval: 'За последние 7 дней',
    thisWeekInterval: 'За эту неделю',
    prevWeekInterval: 'За прошлую неделю',
    thisMonthInterval: 'За этот месяц',
    prevMonthInterval: 'За прошлый месяц',
    thisYearInterval: 'За этот год',
    prevYearInterval: 'За прошлый год',

    customInterval: 'Выбрать начало и конец',
    showButtonHint: 'Обновить график',
    dateFromLabel: 'Начиная с',
    dateToLabel: 'По',
    dateFromHint: 'Начиная с какого срока следует вывести график',
    dateToHint: 'По какой срок следует вывести график',
    visitsHint: 'Отображать общее количество просмотров страниц, либо количество уникальных посетителей. \
                     Просмотр (хит) - Загрузка страницы сайта при переходе посетителя на нее.\
                     Посетитель считается уникальным, если обладает уникальным IP и браузером',
    visitsLabel: 'Посещения',
    sumText: 'Всего за выбранный промежуток:',
    meanText: 'В среднем за выбранный промежуток:',
    printChart: 'Напечатать график',
    downloadJPEG: 'Сохранить как JPEG',
    downloadSVG: 'Сохранить как SVG',
    downloadPNG: 'Сохранить как PNG',
    downloadPDF: 'Сохранить как PDF',
    downloadCSV: 'Сохранить как CSV',
    downloadXLS: 'Сохранить как XLS',
    viewData: 'Просмотреть данные',
    chart: {
        all: 'Просмотры',
        unique: 'Уникальные посетители'
    }
};


export const StatsViewer = (props: HighchartsReact.Props) => {
    const chartComponentRef = React.useRef<HighchartsReact.RefObject>(null);
    const updateHandler = ev => {
        console.log(ev.target)
    }
    return (
        <div>
            {/* <Radio value='month' options={[
                { selected: true, value: 'week', name: strings.weekInterval },
                { selected: false, value: 'thisweek', name: strings.thisWeekInterval },
                { selected: false, value: 'prevweek', name: strings.prevWeekInterval },
                { selected: false, value: 'thismonth', name: strings.thisMonthInterval },
                { selected: false, value: 'prevmonth', name: strings.prevMonthInterval },
                { selected: false, value: 'thisyear', name: strings.thisYearInterval },
                { selected: false, value: 'prevyear', name: strings.prevYearInterval },
            ]}
                updateHandler={updateHandler} name='interval' /> */}
            <HighchartsReact
                highcharts={Highcharts}
                options={props.options}
                ref={chartComponentRef}
                {...props} />
        </div>

    );
}

// export class StatsViewer extends React.Component<any, any> {
//     render() {
//         return <ReactHighcharts config={this.props.config} ref='chart'></ReactHighcharts>
//     }
// }