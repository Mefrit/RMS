import * as  React from 'react'
import HighchartsReact from 'highcharts-react-official'
import * as Highcharts from 'highcharts/highstock'



export const StatsViewer = (props: HighchartsReact.Props) => {
    const chartComponentRef = React.useRef<HighchartsReact.RefObject>(null);
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

