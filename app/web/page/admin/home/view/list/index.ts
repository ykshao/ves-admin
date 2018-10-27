import { Vue, Component, Emit } from 'vue-property-decorator';
import {
  State,
  Getter,
  Action,
  Mutation,
  namespace
} from 'vuex-class';

@Component
export default class List extends Vue {
  @Getter('articleList') articleList: any;
  @Getter('total') total?: number;
  @Action('getArticleList') getArticleList: any;
  @Action('deleteArticle') deleteArticle: any;

  loading: boolean = false;
  batchSelectArray: number[] = [];

  q = {
    title: undefined,
    categoryId: undefined,
    statusId: undefined,
    pageIndex: 1,
    pageSize: 10
  };

  status = [
    { status: undefined, name: '--请选择--' },
    { status: 1, name: '已发布' },
    { status: 2, name: '草稿' }
  ];

  categories = [
    { categoryId: 0, name: '--请选择--' },
    { categoryId: 1, name: 'Nodejs' },
    { categoryId: 2, name: 'Webpack' },
    { categoryId: 3, name: 'Egg' }
  ];

  fetchApi(store: any, json: any) {
    return this.getArticleList(this.q);
  }

  query() {
    this.fetchApi(this.$store, this.q);
  }

  write() {
    this.$router.push('/article/add');
  }

  handleSelectionChange(val: number) {
    console.log('handleSelectionChange', val);
  }

  handleSizeChange(val: number) {
    console.log(`每页 ${val} 条`);
    this.q.pageSize = val;
    this.fetchApi(this.$store, this.q);
  }

  handleCurrentChange(val: number) {
    console.log(`当前页: ${val}`);
    this.q.pageIndex = val;
    this.fetchApi(this.$store, this.q);
  }

  handleEdit(index: number, row: any) {
    this.$message(`你点击了编辑操作 index:${index}, id:${row.id}`);
  }

  handleDelete(index: number, row: any) {
    this.deleteArticle({ id: row.id });
    this.$message(`删除[${row.title}]成功!`);
  }

  // 批量选择
  batchSelect(val: number[]) {
    this.batchSelectArray = val;
  }

  // 批量删除
  batchDel() {
    this.$confirm('将批量删除选择文章, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.loading = true;
      this.$message.success('DELETE');
      this.loading = false;
    });
  }

  beforeMount() {
    if (!(this.articleList && this.articleList.length > 0)) {
      this.fetchApi(this.$store, this.q);
    }
  }
}