<template>
    <div class="aswjgcx">
        <a-collapse v-model="activeKey">
            <a-collapse-panel key="1" header="查询条件" style="text-align:left;">
                <a-form-model :model="searchForm" ref="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-row>
                        <a-col :offset="3" :span="10">
                            <a-form-model-item label="税务机关层级:" prop="swjgcj">
                                <a-select @change="swjgcjHandleChange" v-model="searchForm.swjgcj" defaultValue="01">
                                    <a-select-option value="01">
                                        省
                                    </a-select-option>
                                    <a-select-option value="03">
                                        市
                                    </a-select-option>
                                    <a-select-option value="05">
                                        区县
                                    </a-select-option>
                                    <a-select-option value="07">
                                        分局
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="10">
                            <a-form-model-item label="行业类别:" prop="hylb">
                                <a-select v-model="searchForm.hylb" placeholder="请选择" @change="hylbHandleChange"
                                          defaultValue="MLHY_ID">
                                    <a-select-option value="MLHY_ID">
                                        门类
                                    </a-select-option>
                                    <a-select-option value="DLHY_ID">
                                        大类
                                    </a-select-option>
                                    <a-select-option value="ZLHY_ID">
                                        中类
                                    </a-select-option>
                                    <a-select-option value="XLHY_ID">
                                        小类
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :offset="3" :span="10">
                            <a-form-model-item label="税务机关:">
                                <a-tree-select
                                        v-model="searchForm.swjg"
                                        style="width: 100%"
                                        tree-checkable
                                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                        :tree-data="swjgTreeData"
                                        :replaceFields="{title:'text',value:'id'}"
                                        placeholder="请选择"
                                        :filterTreeNode="swjgTreeFilter"

                                />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="10">
                            <a-form-model-item label="行业:">
                                <a-tree-select
                                        v-model="searchForm.hy"
                                        style="width: 100%"
                                        tree-checkable
                                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                        :tree-data="hyTreeData"
                                        :treeDataSimpleMode="true"
                                        placeholder="请选择"
                                        :treeCheckStrictly="true"
                                        @change="onHyValueChange"
                                        @select="onHySelect"
                                />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :offset="3" :span="10">
                            <a-form-model-item label="所属年度:" prop="ssnd">
                                <a-date-picker v-model="searchForm.ssnd" style="width: 100%" placeholder="请选择"
                                               type="date" valueFormat="YYYY" format="YYYY"/>
                            </a-form-model-item>

                        </a-col>
                    </a-row>
                    <a-row :gutter="24" type="flex" justify="center">
                        <a-col :span="12" style="text-align:right;">
                            <a-button type="primary" @click="beforeQueryTab">
                                查询
                            </a-button>
                        </a-col>
                        <a-col :span="12">
                            <a-button type="primary">
                                重置
                            </a-button>
                        </a-col>
                    </a-row>

                </a-form-model>
            </a-collapse-panel>
        </a-collapse>
        <!--表格区域-->
        <div style="margin-top:20px;">
            <a-table :columns="columns" :data-source="tableData" :rowKey="(record,index)=>{return index}">
                <a slot="name" slot-scope="text">{{ text }}</a>
                <span slot="customTitle"><a-icon type="smile-o"/> 11Name</span>
                <span slot="tags" slot-scope="tags">
              <a-tag
                      v-for="tag in tags"
                      :key="tag"
                      :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
              >
                {{ tag.toUpperCase() }}
              </a-tag>
            </span>
                <span slot="action" slot-scope="text, record">
              <a>Invite 一 {{ record.name }}</a>
              <a-divider type="vertical"/>
              <a>Delete</a>
              <a-divider type="vertical"/>
              <a class="ant-dropdown-link"> More actions <a-icon type="down"/> </a>
            </span>
            </a-table>
        </div>

    </div>

</template>

<script>
    import moment from "moment";

    const columns = [
        {
            dataIndex: 'xh',
            key: 'xh',
            slots: {title: 'customTitle'},
            // scopedSlots: {customRender: 'name11'},
        },
        {
            title: '税务机关代码',
            dataIndex: 'swjg_id',
            key: 'swjg_id',
        },
        {
            title: '税务机关名称',
            dataIndex: 'swjgmc',
            key: 'swjgmc',
        },
        {
            title: '行业名称',
            key: 'hymc',
            dataIndex: 'hymc',
            // scopedSlots: { customRender: 'tags' },
        },
        {
            title: '行业ID',
            key: 'hy_dm',
            dataIndex: 'hy_dm',
            // scopedSlots: { customRender: 'tags' },
        },
        {
            title: '有效样本数',
            key: 'hs',
            dataIndex: 'hs',
            // scopedSlots: { customRender: 'tags' },
        },
        {
            title: '应缴增值税税额（万元）',
            key: 'yjzzs',
            dataIndex: 'yjzzs',
            // scopedSlots: { customRender: 'tags' },
        },
        {
            title: '应税销售收入（万元）',
            key: 'yssr',
            dataIndex: 'yssr',
            // scopedSlots: { customRender: 'tags' },
        },
        {
            title: '税负',
            key: 'sf',
            dataIndex: 'sf',
            // scopedSlots: { customRender: 'tags' },
        },
        {
            title: '操作',
            key: 'action',
            scopedSlots: {customRender: 'action'},
        },
    ];

    export default {
        name: "AswjgCx",
        data() {
            return {
                activeKey: ['1'],
                columns,
                labelCol: {span: 4},
                wrapperCol: {span: 14},
                swjgTreeData: [],
                hyTreeData: [],
                tableData: [],
                searchForm: {
                    swjgcj: '',
                    hylb: '',
                    swjg: undefined,
                    hy: undefined,
                    ssnd: '',
                    tmp_hy_field:''
                },
                rules: {
                    swjgcj: {required: true, message: '请选择税务机关层级', trigger: 'blur'},
                    hylb: {required: true, message: '请选择行业类别', trigger: 'blur'},
                    ssnd: {required: true, message: '请选择所属年度', trigger: 'blur'},

                }
            }
        },
        created() {
            this.searchForm.swjgcj = '01';
            this.searchForm.hylb = 'MLHY_ID';
            this.searchForm.ssnd = '2020';
            this.swjgcjHandleChange(this.searchForm.swjgcj);
            this.hylbHandleChange(this.searchForm.hylb);
        },
        methods: {
            swjgcjHandleChange(e) {
                this.querySwjgTree(e);

            },
            hylbHandleChange(e) {
                this.queryHyTree(e);

            },
            onHyValueChange(value){
              console.log("onHyValueChange",value);
              this.searchForm.hy = value;
            },
            onHySelect(e){
                console.log("onHySelect",e);

            },
            swjgTreeFilter(inputValue, treeNode) {
                let props = treeNode.data.props;
                if (props.title.indexOf(inputValue) > 0) {
                    return true;
                } else {
                    return false;
                }
            },
            querySwjgTree(value) {
                this.$myAxios.get("/selectSwjgLdTree/" + value).then((res) => {
                    this.swjgTreeData = res;
                }).catch((error) => {

                });
            },
            queryHyTree(value) {
                this.$myAxios.get("/selectHyTree/", {hyjc_id: value}).then((res) => {
                    let newTreeData = [];
                    res.forEach((item,index)=>{
                        let value = {};
                       value.dm = item.dm;
                       value.jcdm = item.jcdm;
                       newTreeData.push({
                            id : item.dm,
                            key : item.dm,
                            value : JSON.stringify(value),
                            pId : item.pid,
                            title : item.mc
                       })
                    });

                    this.hyTreeData = newTreeData;
                }).catch((error) => {

                });
            },
            beforeQueryTab() {
                const hyjcJson = {"MLHY_ID": "01", "DLHY_ID": "02", "ZLHY_ID": "03", "MXHY_ID": "04"}
                const value = "0" + this.searchForm.swjgcj + hyjcJson[this.searchForm.hylb];
                let hyNodes = this.searchForm.hy;
                if(hyNodes && hyNodes.length === 0){
                    this.searchForm.dim_hy_field = "";
                }else{
                    this.searchForm.tmp_hy_field = this.searchForm.hylb;
                }
                this.$myAxios.get("/selectJghysflTabQuery/", {tabid: value}).then((res) => {
                    if (res.length === 1) {
                        this.searchForm.tabname = res[0].tabname;
                        console.log("beforeQueryTab/",this.searchForm);
                        this.queryData();
                    }
                }).catch((error) => {
                    alert("查询税负字典表报错，请联系后台运维人员！");
                });
            },
            queryData() {
                this.setSwjgQueryParam();
                this.setHyQueryParam();
                this.$refs.form.validate(valid => {
                    if (valid) {
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
                console.log("queryData/",this.searchForm);
                this.$myAxios.post("/selectAswjgcx/", this.searchForm).then((res) => {
                    console.log("querydata/", res);
                    this.tableData = res;
                }).catch((error) => {
                    console.log('error', error);
                });
            },
            setSwjgQueryParam() {
                let dim_swjg_field = "";
                let dim_swjg_mc = "";
                let dim_swjg_query = "";

                let jgjc_id = this.searchForm.swjgcj;
                if(jgjc_id == "01"){
                    dim_swjg_query = "'11300000000'";
                    dim_swjg_mc = "SWJGMC";
                }else if(jgjc_id == "03"){
                    dim_swjg_query = "DSSWJG_ID";
                    dim_swjg_field = "DSSWJG_ID";
                    dim_swjg_mc = "DSSWJGMC";
                }else if(jgjc_id == "05"){
                    dim_swjg_query = "QXSWJG_ID";
                    dim_swjg_field = "QXSWJG_ID";
                    dim_swjg_mc = "QXSWJGMC";
                }else if(jgjc_id == "07"){
                    dim_swjg_query = "SWJG_ID";
                    dim_swjg_field = "SWJG_ID";
                    dim_swjg_mc = "SWJGMC";
                }

                let dim_swjg_value = this.searchForm.swjgcj;
                if(dim_swjg_value == ""){
                    this.searchForm["dim_swjg_field"]="";
                    this.searchForm["dim_swjg_value"]="";
                }else if(jgjc_id == "01"){
                    this.searchForm["dim_swjg_field"]="";
                    this.searchForm["dim_swjg_value"]="";
                }else{
                    let tmp_swjg_field = "";
                    let swjgArr = dim_swjg_value.split(",");
                    for(let i = 0;i<swjgArr.length;i++){
                        tmp_swjg_field += dim_swjg_field + ",";
                    }
                    this.searchForm["dim_swjg_field"]=tmp_swjg_field;
                    this.searchForm["dim_swjg_value"]=dim_swjg_value.replace(new RegExp(/( )/g),"");
                }

                this.searchForm["dim_swjg_query"]=dim_swjg_query;
                this.searchForm["dim_swjg_mc"]=dim_swjg_mc;
            },
            setHyQueryParam() {
                let dim_hy_value = "";
                let dim_hy_field = "";

                let hyNodes = this.searchForm.hy;
                if(hyNodes != null && hyNodes.length > 0) {
                    for (let i = 0; i < hyNodes.length; i++) {
                        let hyNode = JSON.parse(hyNodes[i].value);
                        if(hyNode.jcdm && hyNode.dm) {
                            dim_hy_field += this.searchForm.tmp_hy_field+",";
                            dim_hy_value+=hyNode.dm+",";
                        } else {
                            continue;
                        }
                    }
                }
                this.searchForm["dim_hy_field"]=dim_hy_field;
                this.searchForm["dim_hy_value"]=dim_hy_value;
            }
        }
    }
</script>

<style scoped>
    .aswjgcx {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
    }
</style>