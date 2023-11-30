<template>
  <div>
    <v-container
      v-if="!isStatusUnchecked && !artifactReleased"
      fill-height
      fluid
      grid-list-xl
    >
      <v-row justify="center">
        <v-col cols="12">
          <material-card
            color="#E64A19"
            title="You do not have access to this artifact"
            text="Please request for access to this artifact to rate and comment."
          >
          </material-card>
        </v-col>
      </v-row>
    </v-container>
    <v-card
      class="mx-auto overflow-hidden"
      elevation="3"
      v-if="artifact.artifact"
    >
      <v-row>
        <v-col cols="10">
          <v-card-title class="align-start">
            <div>
              <span class="headline">{{
                artifact.artifact.title
              }}</span>
            </div>
          </v-card-title>
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <ArtifactChips
            :field="[artifact.artifact.type]"
            :type="artifact.artifact.type"
          ></ArtifactChips>
        </v-col>
      </v-row>

      <span class="ml-4 grey--text text--darken-2 font-weight-light caption">
        {{ artifact.num_reviews }}
        {{ artifact.num_reviews == 1 ? 'review' : 'reviews' }}
      </span>
      <v-rating
        v-model="artifact.avg_rating"
        color="amber"
        dense
        half-increments
        readonly
        size="18"
        class="ml-3"
      ></v-rating>

      <v-card-text v-html="sanitizedDescription"> </v-card-text>

      <div v-if="comments">
        <v-container fluid>
          <SingleComment
            class="mt-2"
            outlined
            tile
            v-for="(comment, i) in commentsReordered"
            :comment="comment"
            :key="i"
          ></SingleComment>
        </v-container>
      </div>

      <v-card-actions>
        <v-btn
          icon
          @click="favoriteThis()"
          :color="favorite == true ? 'red' : ''"
        >
          <v-icon>{{ favorite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          v-if="!artifactRequested "
          color="primary"
          @click="requestArtifact()"
          nuxt
        >
          Request Access
        </v-btn>
        <v-btn
          v-if="artifactRequested && !artifactReleased"
          color="orange"
          nuxt
        >
         Requested
        </v-btn>

        <v-tooltip top content-class="top"
          v-if="artifactRequested && artifactReleased"
        >
          <template v-slot:activator="{ on }">
            <v-btn

              color="green"
              v-on="on"
            >
             Access Granted
            </v-btn>
          </template>
          <span>Your dataset request has been approved and released (check your mailbox)</span>
        </v-tooltip>

      </v-card-actions>
    </v-card>
    <div v-else>{{ loadingMessage }}</div>
  </div>
</template>

<script>
import clip from 'text-clipper'
import { mapState } from 'vuex'
import { artifactIcon, artifactColor, isReleased } from '@/helpers'

export default {
  components: {
    SingleComment: () => import('@/components/SingleComment'),
    ArtifactChips: () => import('@/components/ArtifactChips')
  },
  props: {
    artifact: {
      type: Object,
      required: true
    },
    comments: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      loadingMessage: 'Loading...',
      ticket_status: '',
      isStatusUnchecked : true,
      artifactRequested: false,
      artifactReleased: false,
      expanded: this.comments
        ? Array(this.comments.length)
            .fill(1)
            .map(Number.call, Number)
        : [],

    }
  },
  mounted() {
    setTimeout(() => {
      this.loadingMessage = 'Error loading'
    }, 5000)
  },
  watch: {
    artifact: {
      immediate: true,
      async handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          if (newVal.artifact) {
            await this.updateTicketStatus()
          }
        }
      }
    }
  },
  computed: {
    ...mapState({
      userid: state => state.user.userid,
      favorites: state => state.artifacts.favoritesIDs
    }),
    sanitizedDescription: function() {
      let description = ''
      description = this.artifact.artifact.description
      let out = clip(this.$sanitize(description), 2000, {
        html: true,
        maxLines: 40
      })
      if (out == 'null') return '<br>'
      else return out
    },
    favorite: {
      get() {
        return this.favorites[this.artifact.artifact.artifact_group_id] ? true : false
      },
      set(value) {
        if (value)
          this.$store.commit(
            'artifacts/ADD_FAVORITE',
            this.artifact.artifact.artifact_group_id
          )
        else
          this.$store.commit(
            'artifacts/REMOVE_FAVORITE',
            this.artifact.artifact.artifact_group_id
          )
      }
    },
    commentsReordered() {
      let first = []
      let rest = []
      for (let comment of this.comments) {
        if (comment.review.reviewer.id === this.userid) first.push(comment)
        else rest.push(comment)
      }
      return first.concat(rest)
    }
  },
  methods: {
    async favoriteThis() {
      if (!this.$auth.loggedIn) {
        this.$router.push('/login')
      } else {
        let action = !this.favorite
        this.favorite = !this.favorite
        if (action) {
          // FIXME: backend API
          await this.$favoritesEndpoint.post(this.artifact.artifact.artifact_group_id, {})
        } else {
          await this.$favoritesEndpoint.delete(this.artifact.artifact.artifact_group_id)
        }
      }
    },
    iconColor(type) {
      return artifactColor(type)
    },
    iconImage(type) {
      return artifactIcon(type)
    },
    requestArtifact() {
      if (!this.$auth.loggedIn) {
        this.$router.push('/login')
      } else {
        this.$router.push('/artifact/request/'+this.artifact.artifact.artifact_group_id)
      }
    },
    async updateTicketStatus() {
      let response = await this.$artifactRequestStatusEndpoint.show(this.artifact.artifact.artifact_group_id)
      this.ticket_status = response.ticket_status
      this.artifactRequested = this.ticket_status && this.ticket_status !== "unrequested"
      this.artifactReleased = this.ticket_status && isReleased(this.ticket_status)
      this.isStatusUnchecked = false

    },
  }
}
</script>
