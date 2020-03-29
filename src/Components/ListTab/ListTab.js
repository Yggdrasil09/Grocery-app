import React,{Component} from 'react';
import { Row, Col, Tabs, Form, Button, Select, Alert, Table, Modal, Input } from 'antd';

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
            table:[],
            visible:false,
            canteen_data:[],
            selected_canteen:"",
            selected_name:"",
            selected_number:"",
        };
    };

    formRef = React.createRef();

    showModal = () => {
        this.setState({
          visible: true,
        });
    };

    handleOk = e => {
        let data = {
            Name:this.state.selected_name,
            Zone:this.state.selected_canteen,
            Mobile:this.state.selected_number,
            Order:this.state.table,
        }
        this.setState({
          visible: false,
        },()=>{
            fetch("",{
                methid:"POST",
                body: JSON.stringify(data),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "same-origin"
            })
            .then(res=>{
                window.location.reload();
            })
            .catch(err=>{
                console.log(err);
            })
        });
    };

    handleCancel = e => {
        this.setState({
          visible: false,
        });
    };

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
    };

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

    onCanteenChange = value => {
        this.setState({
            selected_canteen:value
        })
    }

    onNameChange = value => {
        this.setState({
            selected_name:value
        })
    }

    onNumberChange = value => {
        this.setState({
            selected_number:value
        })
    }

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
        fetch("http://localhost:5000/canteens",{
            method:"GET"
        })
        .then(res=>{
            return res.json();
        })
        .then(data=>{
            console.log(data);
            this.setState({
                canteen_data:data
            })
        })
        .catch(err=>{
            console.log(err)
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
                                            <Button className="checkout_but" htmlType="button" onClick={this.showModal}>
                                                Check Out
                                            </Button>
                                            <Modal title="Confirm your Details to place Order" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                                                <Form ref={this.formRef} name="control-ref" >
                                                    <Form.Item name="Canteen" label="Please select your desired drop point and time" rules={[{required: true,},]}>
                                                        <Select placeholder="Select a time" onChange={this.onCanteenChange} allowClear>
                                                            {Object.keys(this.state.canteen_data).map(i => (
                                                                Object.keys(this.state.canteen_data[i]).map(j => (
                                                                    <Option value={i+this.state.canteen_data[i][j]} key={i+this.state.canteen_data[i][j]}>{i+" : "+this.state.canteen_data[i][j]}</Option>
                                                                ))
                                                            ))}
                                                        </Select>
                                                    </Form.Item>
                                                    <Form.Item name="name" onChange={this.onNameChange} label="Please enter your name" rules={[{required: true,},]}>
                                                        <Input placeholder="Enter your name"/>
                                                    </Form.Item>
                                                    <Form.Item name="number" onChange={this.onNumberChange} label="Please enter your mobile number" rules={[{required: true,},]}>
                                                        <Input placeholder="Enter your mobile number"/>
                                                    </Form.Item>
                                                </Form>
                                            </Modal>
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