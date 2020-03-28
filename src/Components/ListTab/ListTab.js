import React,{Component} from 'react';
import { Row, Col, Tabs, Form, Button, Select, Alert, Table } from 'antd';

import './ListTab.css';

const { TabPane } = Tabs;

const { Option } = Select;

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 12,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 12,
  },
};

const columns = [
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
      render: text => <b>{text}</b>,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
        title: 'Total Price',
        dataIndex: 'totalprice',
        key: 'totalprice',
    },
];

class ListTab extends Component{
    
    constructor(){
        super();
        this.state = {
            mode:'top',
            data:[],
            kart:[],
            item:"",
            price:0,
            quantity:0,
            selected_quantity:0,
            table:[]
        };
    }

    formRef = React.createRef();

    onItemChange = value => {
        this.setState({
            item:value,
        },()=>{
            console.log(this.state.item)
            for(let i in this.state.data)
            {
                for(let j in this.state.data[i])
                {
                    if(this.state.data[i][j]["Item Name"] === this.state.item)
                    {
                        this.setState({
                            price:this.state.data[i][j]["Price"],
                            quantity:this.state.data[i][j]["Tab"]
                        })
                    }
                }
            }
        })
    }

    onAmountChange = value => {
        this.setState({
            selected_quantity:value
        })
    };

    onFinish = values => {
        this.setState({
            kart:this.state.kart.concat([values])
        },()=>{
            console.log(this.state.kart)
            this.setState({
                table:this.state.table.concat([{
                    key:this.state.table.length+1,
                    item:this.state.item,
                    quantity:this.state.selected_quantity,
                    price:this.state.price,
                    totalprice:this.state.price*this.state.selected_quantity,
                }])
            })
        })
    };

    componentWillMount(){
        fetch("http://localhost:5000/groceries",{
            method:"GET"
        })
        .then(res=>{
            return res.json();
        })
        .then(data=>{
            console.log(data);
            this.setState({
                data:data
            })
        })
        .catch(err=>{
            console.log(err);
        })
    }

    render(){
        const { mode } = this.state.mode;
        return(
            <div>
                <Row >
                    <Col xs={2} sm={2} md={2} lg={2} xl={1}/>
                    <Col xs={20} sm={20} md={20} lg={20} xl={22}>
                        <Tabs defaultActiveKey="1" tabPosition={mode} style={{ height: "70vh" }} size='large'>
                            {Object.keys(this.state.data).map(i => (
                                <TabPane tab={`${i}`} key={i}>
                                    <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
                                        <Form.Item name="Item" label="Select from list and enter the quantity" rules={[{required: true,},]}>
                                            <Select placeholder="Select a item" onChange={this.onItemChange} allowClear>
                                                {this.state.data[i].map(j => (
                                                    <Option value={j["Item Name"]} key={j["Item Name"]}>{j["Item Name"]}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Alert className="alert-mesg" message={"Price per unit : "+this.state.price+"/-"} type="info" />
                                        <Form.Item name="Quantity" label="Select the quantity" rules={[{required: true,},]}>
                                            <Select placeholder="Select the quantity of item" onChange={this.onAmountChange} allowClear>
                                                {[...Array(this.state.quantity==="Item Out of Stock"?"":parseInt(this.state.quantity)+1).keys()].map(j => (
                                                    <Option value={j} key={j}>{j}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item {...tailLayout}>
                                            <Button type="primary" htmlType="submit" >
                                                Submit
                                            </Button>
                                            <Button type="primary" htmlType="button" >
                                                Check Out
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </TabPane>
                            ))}
                        </Tabs>
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2} xl={1}/>
                </Row>
                <Row>
                    <Col xs={2} sm={2} md={4} lg={4} xl={4}/>
                    <Col xs={20} sm={20} md={16} lg={16} xl={16}>
                        <Table columns={columns} dataSource={this.state.table}/>
                    </Col>
                    <Col xs={2} sm={2} md={4} lg={4} xl={4}/>
                </Row>
            </div>
        );
    }
}

export default ListTab;