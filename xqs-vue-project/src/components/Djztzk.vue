<template>
    <div class="djztzk">
        <a-collapse v-model="activeKey">
            <a-collapse-panel key="1" header="查询条件" style="text-align:left;">
                <a-form-model :model="searchForm" ref="form" :rules="rules" :label-col="labelCol"
                              :wrapper-col="wrapperCol">
                    <a-row>
                        <a-col :offset="3" :span="10">
                            <a-form-model-item label="税务机关:" prop="swjg">
                                <!--tree-checkable :tree-data="swjgTreeData" :filterTreeNode="swjgTreeFilter"-->
                                <a-tree-select
                                        v-model="searchForm.swjg"
                                        style="width: 100%"
                                        :treeDataSimpleMode="true"
                                        :treeCheckStrictly="true"
                                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                        :tree-data="swjgData"
                                        placeholder="请选择"
                                        :filterTreeNode="swjgTreeFilter"
                                        @change="onSwjgValueChange"
                                        @select="onSwjgSelect"
                                />
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="10">
                            <a-form-model-item label="行业:" prop="hy">
                                <a-tree-select
                                        v-model="searchForm.hy"
                                        style="width: 100%"
                                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                        :tree-data="hyData"
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
                            <a-form-model-item label="纳税人状态:">
                                <a-select
                                        mode="multiple"
                                        style="width: 100%"
                                        placeholder="请选择"
                                        @select="nsrztSelect"
                                        v-model="nsrzt"
                                >
                                    <a-select-option v-for="value in nsrztData" :key="value.dm" :value="value.dm">
                                        {{value.dm }}  {{value.mc}}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="10">

                        </a-col>
                    </a-row>
                    <a-row :gutter="24" type="flex" justify="center">
                        <a-col :span="10" style="text-align:right;">
                            <a-button type="primary" @click="BeforedoQuery">
                                查询
                            </a-button>
                        </a-col>
                        <a-col :span="10">
                            <a-button type="primary" @click="doReset">
                                重置
                            </a-button>
                        </a-col>
                        <a-col :span="2">
                            <a-button type="primary" @click="swjgGoBefore">
                                返回
                            </a-button>
                        </a-col>
                    </a-row>

                </a-form-model>
            </a-collapse-panel>
        </a-collapse>
        <!--表格区域-->
        <div style="margin-top:20px;">
            <a-table :columns="tableColumns" :data-source="tableData"
                     :loading="tableLoading"
                     :rowKey="(record,index)=>{return index}">
                <span slot="action" slot-scope="text, record">
                          <a>Invite 一 {{ record.name }}</a>
                          <a-divider type="vertical"/>
                          <a>Delete</a>
                          <a-divider type="vertical"/>
                          <a class="ant-dropdown-link"> More actions <a-icon type="down"/> </a>
                        </span>
                <span slot="zsRender" slot-scope="text, record">
                  <a @click="zsZq(record)">{{ record.hs }}</a>
                </span>
                <span slot="swjgmcRender" slot-scope="text, record">
                    <div v-if="record.swjgjczd !='' && record.swjgjczd != 'KSSWJG_DM'">
                        <a @click="swjgGoNext(record)" >{{ record.swjg_mc }}</a>
                    </div>
                    <div v-else>{{record.swjg_mc}}</div>

                </span>
            </a-table>
        </div>
        <a-modal v-model="nsrmxVisible" okText="关闭" cancelText="返回" title="钻取明细" @ok="closeNsrmxModal" width="800">
            <a-table :columns="nsrmxTableColumns" :data-source="nsrmxTableData"
                     :loading="nsrmxTableLoading"
                     :rowKey="(record,index)=>{return index}">

            </a-table>
        </a-modal>
    </div>

</template>

<script>
    const tableColumns = [
        {
            title: '税务机关',
            dataIndex: 'swjg_mc',
            key: 'swjg_mc',
            width: 180,
            scopedSlots: {customRender: 'swjgmcRender'},
            /*fixed: 'left',*/
        }, {
            title: '总数',
            dataIndex: 'hs',
            key: 'hs',
            width: 100,
            scopedSlots: {customRender: 'zsRender'},
        }, {
            title: '纳税人类型',
            width: 100,
            children: [
                {
                    title: '企业纳税人',
                    dataIndex: 'hs_qy',
                    key: 'hs_qy',
                    width: 100,
                },
                {
                    title: '个体纳税人',
                    dataIndex: 'hs_gt',
                    key: 'hs_gt',
                    width: 100,
                },
            ]
        }
    ];
    const nsrmxTableColumns = [
        {
            title: '纳税人电子档案号',
            dataIndex: 'nsrdzdah',
            key: 'nsrdzdah',
            width: 180
        },{
            title: '纳税人识别号',
            dataIndex: 'nsrsbh',
            key: 'nsrsbhp',
            width: 180
        },{
            title: '纳税人名称',
            dataIndex: 'nsrmc',
            key: 'nsrmc',
            width: 180
        },{
            title: '纳税人状态',
            dataIndex: 'nsrztmc',
            key: 'nsrztmc',
            width: 80
        },{
            title: '主管税务机关',
            dataIndex: 'swjgmc',
            key: 'swjgmc',
            width: 230
        },
    ];
    export default {
        name: "Djztzk",
        data() {
            return {
                tableColumns,
                nsrmxTableColumns,
                activeKey: ['1'],
                labelCol: {span: 4},
                wrapperCol: {span: 14},
                searchForm: {
                    swjg: null,
                    hy: null,
                    nsrzt: '',
                    swjg_dm: null,
                    swjg_jcmc: null,
                    swjg_nextjcmc: null,
                    dim_hy_field: null,
                    dim_hy_value: null
                },
                rules: {
                    swjg: {required: true, trigger: 'blur', message: '请选择税务机关'},
                    hy: {required: true, trigger: 'blur', message: '请选择行业'},
                },
                swjg :undefined,
                hy:undefined,
                nsrzt : undefined,
                swjgData: [],
                hyData: [],
                nsrztData: [],
                tableData: [],
                backSwjg:{},
                nsrmxVisible:false,
                nsrmxTableData :[],
                nsrmxTableLoading : false,
                tableLoading: false
            }

        },
        created() {
            this.loadSwjgData();
            this.loadHyData();
            this.loadNsrztData();
        },
        methods: {
            closeNsrmxModal(){
              this.nsrmxVisible = false;
            },
            loadSwjgData() {
                let valueConfig = ['dm', 'jc', 'pid', 'swjg_jcmc']
                const value = '11301000000';
                this.$myAxios.get("/selectSwjgLdTree/" + value).then((res) => {
                    let newTreeData = [];
                    res.forEach((item, index) => {
                        let value = {};
                        valueConfig.forEach((itemKey, index) => {
                            value[itemKey] = item[itemKey];
                        })
                        newTreeData.push({
                            id: item.dm,
                            key: item.dm,
                            value: JSON.stringify(value),
                            pId: item.pid,
                            title: item.mc
                        })
                    });
                    this.swjgData = newTreeData;
                }).catch((error) => {

                });
            },
            swjgTreeFilter(inputValue, treeNode) {
                let props = treeNode.data.props;
                if (props.title.indexOf(inputValue) > 0) {
                    return true;
                } else {
                    return false;
                }
            },
            onSwjgValueChange(e) {
            },
            onSwjgSelect(e) {
                console.log("onSwjgSelect/", e);
                const result = JSON.parse(e);
                this.searchForm.swjg_jcmc = result.swjg_jcmc;
                this.searchForm.swjg_dm = result.dm;
                this.searchForm.swjg_nextjcmc = this.getXjJgjcmc(result.swjg_jcmc);

            },
            onHyValueChange(e) {
                console.log("onHyValueChange/", e);
            },
            onHySelect(e) {
                console.log("onHySelect/", e);
                const hyNodes = JSON.parse(e);

                if (hyNodes != null) {
                    this.searchForm.dim_hy_field = hyNodes.jcdm;
                    this.searchForm.dim_hy_value = hyNodes.dm;
                }
            },
            getXjJgjcmc(jcmc) {
                if (jcmc === 'ZJSWJG_DM') {
                    return 'SJSWJG_DM';
                } else if (jcmc === 'SJSWJG_DM') {
                    return 'DSSWJG_DM';
                } else if (jcmc === 'DSSWJG_DM') {
                    return 'QXSWJG_DM';
                } else if (jcmc === 'QXSWJG_DM') {
                    return 'KSSWJG_DM';
                }else{
                    return jcmc;
                }

            },
            loadHyData() {
                let valueConfig = ['dm', 'jcdm'];
                this.$myAxios.get("/selectHyTree/").then((res) => {
                    let newTreeData = [];
                    res.forEach((item, index) => {
                        let value = {};
                        valueConfig.forEach((itemKey, index) => {
                            value[itemKey] = item[itemKey];
                        })
                        newTreeData.push({
                            id: item.dm,
                            key: item.dm,
                            value: JSON.stringify(value),
                            pId: item.pid,
                            title: item.mc
                        })
                    });

                    this.hyData = newTreeData;
                }).catch((error) => {

                });
            },
            nsrztSelect(e) {
                console.log("nsrztSelect/", e);
                this.searchForm.nsrzt += "'" + e + "'" + ",";
                console.log(this.searchForm.nsrzt);
            },
            loadNsrztData() {
                this.$myAxios.get("/selectNsrzt/").then((res) => {
                    this.nsrztData = res;
                }).catch((error) => {

                });
            },
            BeforedoQuery() {
                console.log("doQuery/", this.searchForm);
                this.$refs.form.validate(valid =>{
                    if(valid){
                        this.doQuery()
                    }else{
                        console.log('error submit');
                        return false;
                    }
                });

            },
            doQuery() {
                this.tableLoading = true;
                this.$myAxios.get("/selectDjztzkQuery/", this.searchForm).then((res) => {
                    this.tableLoading = false;
                    this.tableData = res;
                }).catch((error) => {

                });
            },
            swjgGoNext(record){
                console.log("swjggonext");
                this.backSwjg = {swjg_dm: this.searchForm.swjg_dm,
                            swjg_jcmc : this.searchForm.swjg_jcmc,
                            swjg_nextjcmc: this.searchForm.swjg_nextjcmc};
                this.searchForm.swjg_dm = record.swjg_dm;
                this.searchForm.swjg_jcmc = record.swjgjczd;
                this.searchForm.swjg_nextjcmc = this.getXjJgjcmc(record.swjgjczd);
                this.BeforedoQuery();
            },
            zsZq(record){
                this.nsrmxVisible = true;
                let nsrMxParam = Object.assign({},this.searchForm);
                nsrMxParam.swjg_dm = record.swjg_dm;
                nsrMxParam.swjg_jcmc = record.swjgjczd;

                console.log("zsZq/",nsrMxParam,"searchForm/",this.searchForm);
                this.$myAxios.get("/selectDjztzkNsrmxQuery/", nsrMxParam).then((res) => {
                    this.nsrmxTableLoading = false;
                    this.nsrmxTableData = res;
                }).catch((error) => {

                });
            },
            swjgGoBefore(){
                this.searchForm.swjg_dm = this.backSwjg.swjg_dm;
                this.searchForm.swjg_jcmc = this.backSwjg.swjg_jcmc;
                this.searchForm.swjg_nextjcmc = this.getXjJgjcmc(this.backSwjg.swjg_jcmc);
                this.BeforedoQuery();

            },
            doReset(){
                console.log("doReset/",this.$refs);
                this.$refs.form.resetFields();
            }
        }

    }
</script>

<style scoped>

</style>