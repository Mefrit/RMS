import * as  React from 'react'
import HighchartsReact from 'highcharts-react-official'
import * as Highcharts from 'highcharts/highstock'

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
        <div className="container">

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