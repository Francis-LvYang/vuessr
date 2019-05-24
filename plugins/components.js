import Vue from 'vue'
import Comment from '../components/comment.vue'
import EditorEdit from '../components/editor-edit.vue'
import EditorPreview from '../components/editor'
import List from '../components/list'
;[Comment, EditorEdit, EditorPreview, List].forEach(component => {
  Vue.component(component.name, component)
})
